const openPromiseResolves = {};
let nextId = 0;
const oldDomain = "https://crazygames.cdn.start.gg/9nm5764dbppg/v5/index.html";
const newDomain = "https://crazygames.cdn.msnfun.com";
const oldDomainOrigin = "cdn.start.gg";
const newDomainOrigin = "cdn.msnfun.com";
const IDBFS = "/idbfs";
const objectStoreName = 'FILE_DATA';

function microsoftMigration() {
    // Get current origin
    const currentOrigin = window.location.origin;
    const currentHref = window.location.href;
    window["oldDomain"] = oldDomain;

    // FETCHER MODE: Running on the new domain
    if (currentHref.indexOf(newDomainOrigin) !== -1) {
        console.log("Migration: Started on new domain");
		
		isIndexedDBAlreadyExist().then((result) => {
			if (result) {
				console.warn("Migration: Stopped on new domain. IndexedDB already exist!");
			} else {
				// Expose functions globally so your game can request data
				setUpIFrame();
				console.log("Migration: iFrame created on new domain");
			}
		});
    }
    // PROVIDER MODE: Running on the old domain
    else if (currentHref.indexOf(oldDomainOrigin) !== -1) {
        console.log("Migration: Started on old domain");

        // Listen for migration requests and respond
        window.addEventListener("message", (eMsg) => {
			if (!hasValidOrigin(eMsg)) {
			    console.warn("Invalid origin:", eMsg.origin);
			    return;
			}
			getResponse(eMsg).then((result) => {
				if (result)
					eMsg.source.postMessage(result, eMsg.origin);
				else
					console.warn("Error getResponse result is NULL!");
			}).catch((error) => {
				console.warn("Error getResponse: ", error);
			});
		});
    }

    function setUpMethods(iFrame) {
        // Listen for responses from the provider (old domain)
        window.addEventListener("message", (eMsg) => {
            const resolve = openPromiseResolves[eMsg.data.id];
            if (resolve) {
                resolve(eMsg.data);
                delete openPromiseResolves[eMsg.data.id];
            }
        });

        window["fetchIndexedDB"] = () => {
            console.log("Migration: fetchIndexedDB on new domain");
            nextId++;
            iFrame.contentWindow.postMessage({ id: nextId }, oldDomain);
            return new Promise((resolve) => {
                openPromiseResolves[nextId] = resolve;
            });
        }
    }
	
	async function isIndexedDBAlreadyExist() {
		try {
			const dbRequest = indexedDB.open(IDBFS);
			
			return await new Promise((resolve, reject) => {
				dbRequest.onsuccess = (event) => {
					const db = event.target.result;
					const isExist = db.objectStoreNames.contains(objectStoreName);
					resolve(isExist);
				};

				dbRequest.onerror = () => {
					resolve(false); 
				};
			});
		} catch (err) {
			return false;
		}
	}

    function requestKeys() {
		window["fetchIndexedDB"]().then((response) => {
			console.log("Received response for indexedDB");
			if (response.response === "playerPrefs") {
				console.log(JSON.stringify(response.value, null, 2));
				window["fetchPlayerPrefs"] = JSON.stringify(response.value, null, 2);
				window.dispatchEvent(new CustomEvent("PlayerPrefsReady"));
				closeIFrame();
			} else {
				console.error("Error fetching indexedDB");
			}
		});
    }

    function setUpIFrame() {
        const iFrame = document.createElement("iframe");
        iFrame.src = window["oldDomain"] + "?" + Date.now();
        iFrame.style.display = "none";
        document.body.appendChild(iFrame);

        window["iFrame"] = iFrame;

        iFrame.addEventListener("load", () => {
            setUpMethods(iFrame);
            requestKeys();
        });
    }
	
	function closeIFrame() {
    	if (window["iFrame"]) {
        	window["iFrame"].remove();
        	delete window["iFrame"];
    	}
    }

    function hasValidOrigin(eMsg) {
        return currentOrigin.indexOf(oldDomainOrigin) !== -1;
    }
	
	async function getResponse(eMsg) {
		const data = eMsg.data;
		console.log("Migration: fetchIndexedDB on old domain");
		
		try {
			const items = await getPlayerPrefsUnity();
			return {
				response: "playerPrefs",
				value: items,
				id: data.id ?? -1
			};
		} catch (error) {
			console.warn("Get data error!: ", error);
			return {
				response: "error",
				value: null,
				id: data.id ?? -1
			};
		}
	}


	function getPlayerPrefsUnity() {
		return new Promise((resolve, reject) => {
			getPlayerPrefsUnityIndexedDB().then((result) => {
				const items = result.items.map(({
					key,
					value
				}) => ({
					[key]: value
				}));

				if (!items.length)
				{
					reject("PlayerPrefsDB is empty!");
					return;
				}

				resolve(items);
			}).catch((error) => {
				reject(error);
			});
		});
	}
	
	function getPlayerPrefsUnityIndexedDB() {
		return new Promise((resolve, reject) => {
			try {
				const dbRequest = indexedDB.open(IDBFS);
				dbRequest.onsuccess = (event) => {
					const db = event.target.result;

					if (!db.objectStoreNames.contains(objectStoreName)) {
						reject(`Object store "${objectStoreName}" does not exist.`);
						return;
					}

					const transaction = db.transaction(objectStoreName, "readonly");
					const store = transaction.objectStore(objectStoreName);
					const cursor = store.openCursor();

					cursor.onsuccess = function(e) {
						const result = e.target.result;
						if (result) {
							var s = result.value;
							if (result.key.includes("PlayerPrefs")) {
								resolve(parsePlayerPrefsBinary(s.contents));
							}
							result['continue']();
						} else {
							reject("No data with this key!");
						}
					};
				};

				dbRequest.onerror = () => {
					reject("Error while iterating through records in IndexedDB");
				};
			} catch (err) {
				reject("Error parse IndexedDB: " + err);
			}
		});
	}
	
	function parsePlayerPrefsBinary(data) {
		const SIGNATURE = "UnityPrf";
		const view = new DataView(data.buffer);
		const result = {};
		const decoder = new TextDecoder();

		let offset = 0;

		// Read header
		result.signature = decoder.decode(new Uint8Array(data.buffer, offset, SIGNATURE.length));
		if (result.signature != SIGNATURE) {
			console.error("Signature is mismatch:", result.signature);
			return;
		}
		offset += SIGNATURE.length;
		// Version?
		result.versionMajor = view.getUint32(offset, true);
		offset += 4;
		result.versionMinor = view.getUint32(offset, true);
		offset += 4;

		let valueLength = 0;
		let value = "";

		let items = [];

		// Read items
		while (offset < data.byteLength) {
			let obj = {};
			const keyLength = view.getUint8(offset);
			offset += 1;

			obj.key = decoder.decode(new Uint8Array(data.buffer, offset, keyLength));
			offset += keyLength;

			type = view.getUint8(offset);
			offset += 1;

			if (type > 0x80 && type < 0xFD || type == 0xFF) {
				console.error("Unsupported value type:", obj.type);
				return;
			}

			switch (type) {
				case 0xFE: // Int value
					obj.type = "int";
					obj.value = view.getInt32(offset, true);
					offset += 4;
					break;
				case 0xFD: // Float value
					obj.type = "float";
					obj.value = view.getFloat32(offset, true);
					offset += 4;
					break;
				case 0x80: // Long string value
					obj.type = "str";
					valueLength = view.getUint32(offset, true);
					offset += 4;

					value = decoder.decode(new Uint8Array(data.buffer, offset, valueLength));
					offset += valueLength;

					obj.value = value;
					break;
				default: // Short string value
					obj.type = "str";
					valueLength = type;

					value = decoder.decode(new Uint8Array(data.buffer, offset, valueLength));
					offset += valueLength;

					obj.value = value;
					break;
			}
			items.push(obj);
		}
		result.items = items;

		return result;
	}
}
