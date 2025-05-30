((scope) => {
	var CryptoJS =
		CryptoJS ||
		((e, n) => {
			var t = {},
				i = (t.lib = {}),
				r = () => {},
				s = (i.Base = {
					extend: function (e) {
						r.prototype = this;
						var n = new r();
						return (
							e && n.mixIn(e),
							n.hasOwnProperty("init") ||
								(n.init = function () {
									n.$super.init.apply(this, arguments);
								}),
							(n.init.prototype = n),
							(n.$super = this),
							n
						);
					},
					create: function () {
						var e = this.extend();
						return e.init.apply(e, arguments), e;
					},
					init: () => {},
					mixIn: function (e) {
						for (var n in e) e.hasOwnProperty(n) && (this[n] = e[n]);
						e.hasOwnProperty("toString") && (this.toString = e.toString);
					},
					clone: function () {
						return this.init.prototype.extend(this);
					},
				}),
				o = (i.WordArray = s.extend({
					init: function (e, n) {
						(e = this.words = e || []),
							(this.sigBytes = void 0 != n ? n : 4 * e.length);
					},
					toString: function (e) {
						return (e || u).stringify(this);
					},
					concat: function (e) {
						var n = this.words,
							t = e.words,
							i = this.sigBytes;
						if (((e = e.sigBytes), this.clamp(), i % 4))
							for (var r = 0; r < e; r++)
								n[(i + r) >>> 2] |=
									((t[r >>> 2] >>> (24 - (r % 4) * 8)) & 255) <<
									(24 - ((i + r) % 4) * 8);
						else if (65535 < t.length)
							for (r = 0; r < e; r += 4) n[(i + r) >>> 2] = t[r >>> 2];
						else n.push.apply(n, t);
						return (this.sigBytes += e), this;
					},
					clamp: function () {
						var n = this.words,
							t = this.sigBytes;
						(n[t >>> 2] &= 4294967295 << (32 - (t % 4) * 8)),
							(n.length = e.ceil(t / 4));
					},
					clone: function () {
						var e = s.clone.call(this);
						return (e.words = this.words.slice(0)), e;
					},
					random: (n) => {
						for (var t = [], i = 0; i < n; i += 4)
							t.push((4294967296 * e.random()) | 0);
						return new o.init(t, n);
					},
				})),
				a = (t.enc = {}),
				u = (a.Hex = {
					stringify: (e) => {
						var n = e.words;
						e = e.sigBytes;
						for (var t = [], i = 0; i < e; i++) {
							var r = (n[i >>> 2] >>> (24 - (i % 4) * 8)) & 255;
							t.push((r >>> 4).toString(16)), t.push((15 & r).toString(16));
						}
						return t.join("");
					},
					parse: (e) => {
						for (var n = e.length, t = [], i = 0; i < n; i += 2)
							t[i >>> 3] |=
								Number.parseInt(e.substr(i, 2), 16) << (24 - (i % 8) * 4);
						return new o.init(t, n / 2);
					},
				}),
				c = (a.Latin1 = {
					stringify: (e) => {
						var n = e.words;
						e = e.sigBytes;
						for (var t = [], i = 0; i < e; i++)
							t.push(
								String.fromCharCode((n[i >>> 2] >>> (24 - (i % 4) * 8)) & 255),
							);
						return t.join("");
					},
					parse: (e) => {
						for (var n = e.length, t = [], i = 0; i < n; i++)
							t[i >>> 2] |= (255 & e.charCodeAt(i)) << (24 - (i % 4) * 8);
						return new o.init(t, n);
					},
				}),
				d = (a.Utf8 = {
					stringify: (e) => {
						try {
							return decodeURIComponent(escape(c.stringify(e)));
						} catch (e) {
							throw Error("Malformed UTF-8 data");
						}
					},
					parse: (e) => c.parse(unescape(encodeURIComponent(e))),
				}),
				l = (i.BufferedBlockAlgorithm = s.extend({
					reset: function () {
						(this._data = new o.init()), (this._nDataBytes = 0);
					},
					_append: function (e) {
						"string" == typeof e && (e = d.parse(e)),
							this._data.concat(e),
							(this._nDataBytes += e.sigBytes);
					},
					_process: function (n) {
						var t = this._data,
							i = t.words,
							r = t.sigBytes,
							s = this.blockSize,
							a = r / (4 * s),
							a = n ? e.ceil(a) : e.max((0 | a) - this._minBufferSize, 0);
						if (((n = a * s), (r = e.min(4 * n, r)), n)) {
							for (var u = 0; u < n; u += s) this._doProcessBlock(i, u);
							(u = i.splice(0, n)), (t.sigBytes -= r);
						}
						return new o.init(u, r);
					},
					clone: function () {
						var e = s.clone.call(this);
						return (e._data = this._data.clone()), e;
					},
					_minBufferSize: 0,
				}));
			i.Hasher = l.extend({
				cfg: s.extend(),
				init: function (e) {
					(this.cfg = this.cfg.extend(e)), this.reset();
				},
				reset: function () {
					l.reset.call(this), this._doReset();
				},
				update: function (e) {
					return this._append(e), this._process(), this;
				},
				finalize: function (e) {
					return e && this._append(e), this._doFinalize();
				},
				blockSize: 16,
				_createHelper: (e) => (n, t) => new e.init(t).finalize(n),
				_createHmacHelper: (e) => (n, t) => new f.HMAC.init(e, t).finalize(n),
			});
			var f = (t.algo = {});
			return t;
		})(Math);
	!((e) => {
		for (
			var n = CryptoJS,
				t = n.lib,
				i = t.WordArray,
				r = t.Hasher,
				t = n.algo,
				s = [],
				o = [],
				a = (e) => (4294967296 * (e - (0 | e))) | 0,
				u = 2,
				c = 0;
			64 > c;
		) {
			var d;
			e: {
				d = u;
				for (var l = e.sqrt(d), f = 2; f <= l; f++)
					if (!(d % f)) {
						d = !1;
						break e;
					}
				d = !0;
			}
			d &&
				(8 > c && (s[c] = a(e.pow(u, 0.5))), (o[c] = a(e.pow(u, 1 / 3))), c++),
				u++;
		}
		var v = [],
			t = (t.SHA256 = r.extend({
				_doReset: function () {
					this._hash = new i.init(s.slice(0));
				},
				_doProcessBlock: function (e, n) {
					for (
						var t = this._hash.words,
							i = t[0],
							r = t[1],
							s = t[2],
							a = t[3],
							u = t[4],
							c = t[5],
							d = t[6],
							l = t[7],
							f = 0;
						64 > f;
						f++
					) {
						if (16 > f) v[f] = 0 | e[n + f];
						else {
							var g = v[f - 15],
								m = v[f - 2];
							v[f] =
								(((g << 25) | (g >>> 7)) ^
									((g << 14) | (g >>> 18)) ^
									(g >>> 3)) +
								v[f - 7] +
								(((m << 15) | (m >>> 17)) ^
									((m << 13) | (m >>> 19)) ^
									(m >>> 10)) +
								v[f - 16];
						}
						(g =
							l +
							(((u << 26) | (u >>> 6)) ^
								((u << 21) | (u >>> 11)) ^
								((u << 7) | (u >>> 25))) +
							((u & c) ^ (~u & d)) +
							o[f] +
							v[f]),
							(m =
								(((i << 30) | (i >>> 2)) ^
									((i << 19) | (i >>> 13)) ^
									((i << 10) | (i >>> 22))) +
								((i & r) ^ (i & s) ^ (r & s))),
							(l = d),
							(d = c),
							(c = u),
							(u = (a + g) | 0),
							(a = s),
							(s = r),
							(r = i),
							(i = (g + m) | 0);
					}
					(t[0] = (t[0] + i) | 0),
						(t[1] = (t[1] + r) | 0),
						(t[2] = (t[2] + s) | 0),
						(t[3] = (t[3] + a) | 0),
						(t[4] = (t[4] + u) | 0),
						(t[5] = (t[5] + c) | 0),
						(t[6] = (t[6] + d) | 0),
						(t[7] = (t[7] + l) | 0);
				},
				_doFinalize: function () {
					var n = this._data,
						t = n.words,
						i = 8 * this._nDataBytes,
						r = 8 * n.sigBytes;
					return (
						(t[r >>> 5] |= 128 << (24 - (r % 32))),
						(t[14 + (((r + 64) >>> 9) << 4)] = e.floor(i / 4294967296)),
						(t[15 + (((r + 64) >>> 9) << 4)] = i),
						(n.sigBytes = 4 * t.length),
						this._process(),
						this._hash
					);
				},
				clone: function () {
					var e = r.clone.call(this);
					return (e._hash = this._hash.clone()), e;
				},
			}));
		(n.SHA256 = r._createHelper(t)), (n.HmacSHA256 = r._createHmacHelper(t));
	})(Math),
		(() => {
			var e = CryptoJS,
				n = e.enc.Utf8;
			e.algo.HMAC = e.lib.Base.extend({
				init: function (e, t) {
					(e = this._hasher = new e.init()),
						"string" == typeof t && (t = n.parse(t));
					var i = e.blockSize,
						r = 4 * i;
					t.sigBytes > r && (t = e.finalize(t)), t.clamp();
					for (
						var s = (this._oKey = t.clone()),
							o = (this._iKey = t.clone()),
							a = s.words,
							u = o.words,
							c = 0;
						c < i;
						c++
					)
						(a[c] ^= 1549556828), (u[c] ^= 909522486);
					(s.sigBytes = o.sigBytes = r), this.reset();
				},
				reset: function () {
					var e = this._hasher;
					e.reset(), e.update(this._iKey);
				},
				update: function (e) {
					return this._hasher.update(e), this;
				},
				finalize: function (e) {
					var n = this._hasher;
					return (
						(e = n.finalize(e)),
						n.reset(),
						n.finalize(this._oKey.clone().concat(e))
					);
				},
			});
		})(),
		(() => {
			var e = CryptoJS,
				n = e.lib.WordArray;
			e.enc.Base64 = {
				stringify: function (e) {
					var n = e.words,
						t = e.sigBytes,
						i = this._map;
					e.clamp(), (e = []);
					for (var r = 0; r < t; r += 3)
						for (
							var s =
									(((n[r >>> 2] >>> (24 - (r % 4) * 8)) & 255) << 16) |
									(((n[(r + 1) >>> 2] >>> (24 - ((r + 1) % 4) * 8)) & 255) <<
										8) |
									((n[(r + 2) >>> 2] >>> (24 - ((r + 2) % 4) * 8)) & 255),
								o = 0;
							4 > o && r + 0.75 * o < t;
							o++
						)
							e.push(i.charAt((s >>> (6 * (3 - o))) & 63));
					if ((n = i.charAt(64))) while (e.length % 4) e.push(n);
					return e.join("");
				},
				parse: function (e) {
					var t = e.length,
						i = this._map,
						r = i.charAt(64);
					r && -1 != (r = e.indexOf(r)) && (t = r);
					for (var r = [], s = 0, o = 0; o < t; o++)
						if (o % 4) {
							var a = i.indexOf(e.charAt(o - 1)) << ((o % 4) * 2),
								u = i.indexOf(e.charAt(o)) >>> (6 - (o % 4) * 2);
							(r[s >>> 2] |= (a | u) << (24 - (s % 4) * 8)), s++;
						}
					return n.create(r, s);
				},
				_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			};
		})();
	var gameanalytics;
	!((e) => {
		!((e) => {
			(e[(e.Undefined = 0)] = "Undefined"),
				(e[(e.Debug = 1)] = "Debug"),
				(e[(e.Info = 2)] = "Info"),
				(e[(e.Warning = 3)] = "Warning"),
				(e[(e.Error = 4)] = "Error"),
				(e[(e.Critical = 5)] = "Critical");
		})(e.EGAErrorSeverity || (e.EGAErrorSeverity = {}));
		!((e) => {
			(e[(e.Undefined = 0)] = "Undefined"),
				(e[(e.Male = 1)] = "Male"),
				(e[(e.Female = 2)] = "Female");
		})(e.EGAGender || (e.EGAGender = {}));
		!((e) => {
			(e[(e.Undefined = 0)] = "Undefined"),
				(e[(e.Start = 1)] = "Start"),
				(e[(e.Complete = 2)] = "Complete"),
				(e[(e.Fail = 3)] = "Fail");
		})(e.EGAProgressionStatus || (e.EGAProgressionStatus = {}));
		!((e) => {
			(e[(e.Undefined = 0)] = "Undefined"),
				(e[(e.Source = 1)] = "Source"),
				(e[(e.Sink = 2)] = "Sink");
		})(e.EGAResourceFlowType || (e.EGAResourceFlowType = {}));
		!((e) => {
			!((e) => {
				(e[(e.Undefined = 0)] = "Undefined"),
					(e[(e.Rejected = 1)] = "Rejected");
			})(e.EGASdkErrorType || (e.EGASdkErrorType = {}));
			!((e) => {
				(e[(e.NoResponse = 0)] = "NoResponse"),
					(e[(e.BadResponse = 1)] = "BadResponse"),
					(e[(e.RequestTimeout = 2)] = "RequestTimeout"),
					(e[(e.JsonEncodeFailed = 3)] = "JsonEncodeFailed"),
					(e[(e.JsonDecodeFailed = 4)] = "JsonDecodeFailed"),
					(e[(e.InternalServerError = 5)] = "InternalServerError"),
					(e[(e.BadRequest = 6)] = "BadRequest"),
					(e[(e.Unauthorized = 7)] = "Unauthorized"),
					(e[(e.UnknownResponseCode = 8)] = "UnknownResponseCode"),
					(e[(e.Ok = 9)] = "Ok");
			})(e.EGAHTTPApiResponse || (e.EGAHTTPApiResponse = {}));
		})(e.http || (e.http = {}));
	})(gameanalytics || (gameanalytics = {}));
	var EGAErrorSeverity = gameanalytics.EGAErrorSeverity,
		EGAGender = gameanalytics.EGAGender,
		EGAProgressionStatus = gameanalytics.EGAProgressionStatus,
		EGAResourceFlowType = gameanalytics.EGAResourceFlowType,
		gameanalytics;
	!((e) => {
		!((e) => {
			var n;
			!((e) => {
				(e[(e.Error = 0)] = "Error"),
					(e[(e.Warning = 1)] = "Warning"),
					(e[(e.Info = 2)] = "Info"),
					(e[(e.Debug = 3)] = "Debug");
			})(n || (n = {}));
			var t = (() => {
				function e() {
					e.debugEnabled = !1;
				}
				return (
					(e.setInfoLog = (n) => {
						e.instance.infoLogEnabled = n;
					}),
					(e.setVerboseLog = (n) => {
						e.instance.infoLogVerboseEnabled = n;
					}),
					(e.i = (t) => {
						if (e.instance.infoLogEnabled) {
							var i = "Info/" + e.Tag + ": " + t;
							e.instance.sendNotificationMessage(i, n.Info);
						}
					}),
					(e.w = (t) => {
						var i = "Warning/" + e.Tag + ": " + t;
						e.instance.sendNotificationMessage(i, n.Warning);
					}),
					(e.e = (t) => {
						var i = "Error/" + e.Tag + ": " + t;
						e.instance.sendNotificationMessage(i, n.Error);
					}),
					(e.ii = (t) => {
						if (e.instance.infoLogVerboseEnabled) {
							var i = "Verbose/" + e.Tag + ": " + t;
							e.instance.sendNotificationMessage(i, n.Info);
						}
					}),
					(e.d = (t) => {
						if (e.debugEnabled) {
							var i = "Debug/" + e.Tag + ": " + t;
							e.instance.sendNotificationMessage(i, n.Debug);
						}
					}),
					(e.prototype.sendNotificationMessage = (e, t) => {
						switch (t) {
							case n.Error:
								console.error(e);
								break;
							case n.Warning:
								console.warn(e);
								break;
							case n.Debug:
								"function" == typeof console.debug
									? console.debug(e)
									: console.log(e);
								break;
							case n.Info:
								console.log(e);
						}
					}),
					e
				);
			})();
			(t.instance = new t()), (t.Tag = "GameAnalytics"), (e.GALogger = t);
		})(e.logging || (e.logging = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		!((n) => {
			var t = e.logging.GALogger,
				i = (() => {
					function e() {}
					return (
						(e.getHmac = (e, n) => {
							var t = CryptoJS.HmacSHA256(n, e);
							return CryptoJS.enc.Base64.stringify(t);
						}),
						(e.stringMatch = (e, n) => !(!e || !n) && n.test(e)),
						(e.joinStringArray = (e, n) => {
							for (var t = "", i = 0, r = e.length; i < r; i++)
								i > 0 && (t += n), (t += e[i]);
							return t;
						}),
						(e.stringArrayContainsString = (e, n) => {
							if (0 === e.length) return !1;
							for (var t in e) if (e[t] === n) return !0;
							return !1;
						}),
						(e.encode64 = (n) => {
							n = encodeURI(n);
							var t,
								i,
								r,
								s,
								o,
								a = "",
								u = 0,
								c = 0,
								d = 0;
							do {
								(t = n.charCodeAt(d++)),
									(i = n.charCodeAt(d++)),
									(u = n.charCodeAt(d++)),
									(r = t >> 2),
									(s = ((3 & t) << 4) | (i >> 4)),
									(o = ((15 & i) << 2) | (u >> 6)),
									(c = 63 & u),
									isNaN(i) ? (o = c = 64) : isNaN(u) && (c = 64),
									(a =
										a +
										e.keyStr.charAt(r) +
										e.keyStr.charAt(s) +
										e.keyStr.charAt(o) +
										e.keyStr.charAt(c)),
									(t = i = u = 0),
									(r = s = o = c = 0);
							} while (d < n.length);
							return a;
						}),
						(e.decode64 = (n) => {
							var i,
								r,
								s,
								o,
								a,
								u = "",
								c = 0,
								d = 0,
								l = 0;
							/[^A-Za-z0-9\+\/\=]/g.exec(n) &&
								t.w(
									"There were invalid base64 characters in the input text. Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='. Expect errors in decoding.",
								),
								(n = n.replace(/[^A-Za-z0-9\+\/\=]/g, ""));
							do {
								(s = e.keyStr.indexOf(n.charAt(l++))),
									(o = e.keyStr.indexOf(n.charAt(l++))),
									(a = e.keyStr.indexOf(n.charAt(l++))),
									(d = e.keyStr.indexOf(n.charAt(l++))),
									(i = (s << 2) | (o >> 4)),
									(r = ((15 & o) << 4) | (a >> 2)),
									(c = ((3 & a) << 6) | d),
									(u += String.fromCharCode(i)),
									64 != a && (u += String.fromCharCode(r)),
									64 != d && (u += String.fromCharCode(c)),
									(i = r = c = 0),
									(s = o = a = d = 0);
							} while (l < n.length);
							return decodeURI(u);
						}),
						(e.timeIntervalSince1970 = () => {
							var e = new Date();
							return Math.round(e.getTime() / 1e3);
						}),
						(e.createGuid = () =>
							(
								e.s4() +
								e.s4() +
								"-" +
								e.s4() +
								"-4" +
								e.s4().substr(0, 3) +
								"-" +
								e.s4() +
								"-" +
								e.s4() +
								e.s4() +
								e.s4()
							).toLowerCase()),
						(e.s4 = () =>
							((65536 * (1 + Math.random())) | 0).toString(16).substring(1)),
						e
					);
				})();
			(i.keyStr =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="),
				(n.GAUtilities = i);
		})(e.utilities || (e.utilities = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		!((n) => {
			var t = e.logging.GALogger,
				i = e.http.EGASdkErrorType,
				r = e.utilities.GAUtilities,
				s = (() => {
					function n() {}
					return (
						(n.validateBusinessEvent = (e, i, r, s, o) =>
							n.validateCurrency(e)
								? n.validateShortString(r, !0)
									? n.validateEventPartLength(s, !1)
										? n.validateEventPartCharacters(s)
											? n.validateEventPartLength(o, !1)
												? !!n.validateEventPartCharacters(o) ||
													(t.i(
														"Validation fail - business event - itemId: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " +
															o,
													),
													!1)
												: (t.i(
														"Validation fail - business event - itemId. Cannot be (null), empty or above 64 characters. String: " +
															o,
													),
													!1)
											: (t.i(
													"Validation fail - business event - itemType: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " +
														s,
												),
												!1)
										: (t.i(
												"Validation fail - business event - itemType: Cannot be (null), empty or above 64 characters. String: " +
													s,
											),
											!1)
									: (t.i(
											"Validation fail - business event - cartType. Cannot be above 32 length. String: " +
												r,
										),
										!1)
								: (t.i(
										"Validation fail - business event - currency: Cannot be (null) and need to be A-Z, 3 characters and in the standard at openexchangerates.org. Failed currency: " +
											e,
									),
									!1)),
						(n.validateResourceEvent = (i, s, o, a, u, c, d) =>
							i == e.EGAResourceFlowType.Undefined
								? (t.i(
										"Validation fail - resource event - flowType: Invalid flow type.",
									),
									!1)
								: s
									? r.stringArrayContainsString(c, s)
										? o > 0
											? a
												? n.validateEventPartLength(a, !1)
													? n.validateEventPartCharacters(a)
														? r.stringArrayContainsString(d, a)
															? n.validateEventPartLength(u, !1)
																? !!n.validateEventPartCharacters(u) ||
																	(t.i(
																		"Validation fail - resource event - itemId: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " +
																			u,
																	),
																	!1)
																: (t.i(
																		"Validation fail - resource event - itemId: Cannot be (null), empty or above 64 characters. String: " +
																			u,
																	),
																	!1)
															: (t.i(
																	"Validation fail - resource event - itemType: Not found in list of pre-defined available resource itemTypes. String: " +
																		a,
																),
																!1)
														: (t.i(
																"Validation fail - resource event - itemType: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " +
																	a,
															),
															!1)
													: (t.i(
															"Validation fail - resource event - itemType: Cannot be (null), empty or above 64 characters. String: " +
																a,
														),
														!1)
												: (t.i(
														"Validation fail - resource event - itemType: Cannot be (null)",
													),
													!1)
											: (t.i(
													"Validation fail - resource event - amount: Float amount cannot be 0 or negative. Value: " +
														o,
												),
												!1)
										: (t.i(
												"Validation fail - resource event - currency: Not found in list of pre-defined available resource currencies. String: " +
													s,
											),
											!1)
									: (t.i(
											"Validation fail - resource event - currency: Cannot be (null)",
										),
										!1)),
						(n.validateProgressionEvent = (i, r, s, o) => {
							if (i == e.EGAProgressionStatus.Undefined)
								return (
									t.i(
										"Validation fail - progression event: Invalid progression status.",
									),
									!1
								);
							if (o && !s && r)
								return (
									t.i(
										"Validation fail - progression event: 03 found but 01+02 are invalid. Progression must be set as either 01, 01+02 or 01+02+03.",
									),
									!1
								);
							if (s && !r)
								return (
									t.i(
										"Validation fail - progression event: 02 found but not 01. Progression must be set as either 01, 01+02 or 01+02+03",
									),
									!1
								);
							if (!r)
								return (
									t.i(
										"Validation fail - progression event: progression01 not valid. Progressions must be set as either 01, 01+02 or 01+02+03",
									),
									!1
								);
							if (!n.validateEventPartLength(r, !1))
								return (
									t.i(
										"Validation fail - progression event - progression01: Cannot be (null), empty or above 64 characters. String: " +
											r,
									),
									!1
								);
							if (!n.validateEventPartCharacters(r))
								return (
									t.i(
										"Validation fail - progression event - progression01: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " +
											r,
									),
									!1
								);
							if (s) {
								if (!n.validateEventPartLength(s, !0))
									return (
										t.i(
											"Validation fail - progression event - progression02: Cannot be empty or above 64 characters. String: " +
												s,
										),
										!1
									);
								if (!n.validateEventPartCharacters(s))
									return (
										t.i(
											"Validation fail - progression event - progression02: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " +
												s,
										),
										!1
									);
							}
							if (o) {
								if (!n.validateEventPartLength(o, !0))
									return (
										t.i(
											"Validation fail - progression event - progression03: Cannot be empty or above 64 characters. String: " +
												o,
										),
										!1
									);
								if (!n.validateEventPartCharacters(o))
									return (
										t.i(
											"Validation fail - progression event - progression03: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " +
												o,
										),
										!1
									);
							}
							return !0;
						}),
						(n.validateDesignEvent = (e, i) =>
							n.validateEventIdLength(e)
								? !!n.validateEventIdCharacters(e) ||
									(t.i(
										"Validation fail - design event - eventId: Non valid characters. Only allowed A-z, 0-9, -_., ()!?. String: " +
											e,
									),
									!1)
								: (t.i(
										"Validation fail - design event - eventId: Cannot be (null) or empty. Only 5 event parts allowed seperated by :. Each part need to be 32 characters or less. String: " +
											e,
									),
									!1)),
						(n.validateErrorEvent = (i, r) =>
							i == e.EGAErrorSeverity.Undefined
								? (t.i(
										"Validation fail - error event - severity: Severity was unsupported value.",
									),
									!1)
								: !!n.validateLongString(r, !0) ||
									(t.i(
										"Validation fail - error event - message: Message cannot be above 8192 characters.",
									),
									!1)),
						(n.validateSdkErrorEvent = (e, r, s) =>
							!!n.validateKeys(e, r) &&
							(s !== i.Undefined ||
								(t.i(
									"Validation fail - sdk error event - type: Type was unsupported value.",
								),
								!1))),
						(n.validateKeys = (e, n) =>
							!(
								!r.stringMatch(e, /^[A-z0-9]{32}$/) ||
								!r.stringMatch(n, /^[A-z0-9]{40}$/)
							)),
						(n.validateCurrency = (e) =>
							!!e && !!r.stringMatch(e, /^[A-Z]{3}$/)),
						(n.validateEventPartLength = (e, n) =>
							!(!n || e) || (!!e && !(e.length > 64))),
						(n.validateEventPartCharacters = (e) =>
							!!r.stringMatch(e, /^[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}$/)),
						(n.validateEventIdLength = (e) =>
							!!e && !!r.stringMatch(e, /^[^:]{1,64}(?::[^:]{1,64}){0,4}$/)),
						(n.validateEventIdCharacters = (e) =>
							!!e &&
							!!r.stringMatch(
								e,
								/^[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}(:[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}){0,4}$/,
							)),
						(n.validateAndCleanInitRequestResponse = (e) => {
							if (null == e)
								return (
									t.w(
										"validateInitRequestResponse failed - no response dictionary.",
									),
									null
								);
							var n = {};
							try {
								n.enabled = e.enabled;
							} catch (e) {
								return (
									t.w(
										"validateInitRequestResponse failed - invalid type in 'enabled' field.",
									),
									null
								);
							}
							try {
								var i = e.server_ts;
								if (!(i > 0))
									return (
										t.w(
											"validateInitRequestResponse failed - invalid value in 'server_ts' field.",
										),
										null
									);
								n.server_ts = i;
							} catch (n) {
								return (
									t.w(
										"validateInitRequestResponse failed - invalid type in 'server_ts' field. type=" +
											typeof e.server_ts +
											", value=" +
											e.server_ts +
											", " +
											n,
									),
									null
								);
							}
							return n;
						}),
						(n.validateBuild = (e) => !!n.validateShortString(e, !1)),
						(n.validateSdkWrapperVersion = (e) =>
							!!r.stringMatch(
								e,
								/^(unity|unreal|gamemaker|cocos2d|construct|defold) [0-9]{0,5}(\.[0-9]{0,5}){0,2}$/,
							)),
						(n.validateEngineVersion = (e) =>
							!(
								!e ||
								!r.stringMatch(
									e,
									/^(unity|unreal|gamemaker|cocos2d|construct|defold) [0-9]{0,5}(\.[0-9]{0,5}){0,2}$/,
								)
							)),
						(n.validateUserId = (e) =>
							!!n.validateString(e, !1) ||
							(t.i(
								"Validation fail - user id: id cannot be (null), empty or above 64 characters.",
							),
							!1)),
						(n.validateShortString = (e, n) =>
							!(!n || e) || !(!e || e.length > 32)),
						(n.validateString = (e, n) => !(!n || e) || !(!e || e.length > 64)),
						(n.validateLongString = (e, n) =>
							!(!n || e) || !(!e || e.length > 8192)),
						(n.validateConnectionType = (e) =>
							r.stringMatch(e, /^(wwan|wifi|lan|offline)$/)),
						(n.validateCustomDimensions = (e) =>
							n.validateArrayOfStrings(20, 32, !1, "custom dimensions", e)),
						(n.validateResourceCurrencies = (e) => {
							if (
								!n.validateArrayOfStrings(20, 64, !1, "resource currencies", e)
							)
								return !1;
							for (var i = 0; i < e.length; ++i)
								if (!r.stringMatch(e[i], /^[A-Za-z]+$/))
									return (
										t.i(
											"resource currencies validation failed: a resource currency can only be A-Z, a-z. String was: " +
												e[i],
										),
										!1
									);
							return !0;
						}),
						(n.validateResourceItemTypes = (e) => {
							if (
								!n.validateArrayOfStrings(20, 32, !1, "resource item types", e)
							)
								return !1;
							for (var i = 0; i < e.length; ++i)
								if (!n.validateEventPartCharacters(e[i]))
									return (
										t.i(
											"resource item types validation failed: a resource item type cannot contain other characters than A-z, 0-9, -_., ()!?. String was: " +
												e[i],
										),
										!1
									);
							return !0;
						}),
						(n.validateDimension01 = (e, n) =>
							!e || !!r.stringArrayContainsString(n, e)),
						(n.validateDimension02 = (e, n) =>
							!e || !!r.stringArrayContainsString(n, e)),
						(n.validateDimension03 = (e, n) =>
							!e || !!r.stringArrayContainsString(n, e)),
						(n.validateArrayOfStrings = (e, n, i, r, s) => {
							var o = r;
							if ((o || (o = "Array"), !s))
								return (
									t.i(o + " validation failed: array cannot be null. "), !1
								);
							if (0 == i && 0 == s.length)
								return (
									t.i(o + " validation failed: array cannot be empty. "), !1
								);
							if (e > 0 && s.length > e)
								return (
									t.i(
										o +
											" validation failed: array cannot exceed " +
											e +
											" values. It has " +
											s.length +
											" values.",
									),
									!1
								);
							for (var a = 0; a < s.length; ++a) {
								var u = s[a] ? s[a].length : 0;
								if (0 === u)
									return (
										t.i(
											o +
												" validation failed: contained an empty string. Array=" +
												JSON.stringify(s),
										),
										!1
									);
								if (n > 0 && u > n)
									return (
										t.i(
											o +
												" validation failed: a string exceeded max allowed length (which is: " +
												n +
												"). String was: " +
												s[a],
										),
										!1
									);
							}
							return !0;
						}),
						(n.validateFacebookId = (e) =>
							!!n.validateString(e, !1) ||
							(t.i(
								"Validation fail - facebook id: id cannot be (null), empty or above 64 characters.",
							),
							!1)),
						(n.validateGender = (n) => {
							if (isNaN(Number(e.EGAGender[n]))) {
								if (
									n == e.EGAGender.Undefined ||
									(n != e.EGAGender.Male && n != e.EGAGender.Female)
								)
									return (
										t.i(
											"Validation fail - gender: Has to be 'male' or 'female'. Was: " +
												n,
										),
										!1
									);
							} else if (
								n == e.EGAGender[e.EGAGender.Undefined] ||
								(n != e.EGAGender[e.EGAGender.Male] &&
									n != e.EGAGender[e.EGAGender.Female])
							)
								return (
									t.i(
										"Validation fail - gender: Has to be 'male' or 'female'. Was: " +
											n,
									),
									!1
								);
							return !0;
						}),
						(n.validateBirthyear = (e) =>
							!(e < 0 || e > 9999) ||
							(t.i(
								"Validation fail - birthYear: Cannot be (null) or invalid range.",
							),
							!1)),
						(n.validateClientTs = (e) => !(e < -4294967294 || e > 4294967294)),
						n
					);
				})();
			n.GAValidator = s;
		})(e.validators || (e.validators = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		!((e) => {
			var n = (() => {
				function e(e, n, t) {
					(this.name = e), (this.value = n), (this.version = t);
				}
				return e;
			})();
			e.NameValueVersion = n;
			var t = (() => {
				function e(e, n) {
					(this.name = e), (this.version = n);
				}
				return e;
			})();
			e.NameVersion = t;
			var i = (() => {
				function e() {}
				return (
					(e.touch = () => {}),
					(e.getRelevantSdkVersion = () =>
						e.sdkGameEngineVersion
							? e.sdkGameEngineVersion
							: e.sdkWrapperVersion),
					(e.getConnectionType = () => e.connectionType),
					(e.updateConnectionType = () => {
						navigator.onLine
							? "ios" === e.buildPlatform || "android" === e.buildPlatform
								? (e.connectionType = "wwan")
								: (e.connectionType = "lan")
							: (e.connectionType = "offline");
					}),
					(e.getOSVersionString = () =>
						e.buildPlatform + " " + e.osVersionPair.version),
					(e.runtimePlatformToString = () => e.osVersionPair.name),
					(e.getBrowserVersionString = () => {
						var e,
							n = navigator.userAgent,
							t =
								n.match(
									/(opera|chrome|safari|firefox|ubrowser|msie|trident|fbav(?=\/))\/?\s*(\d+)/i,
								) || [];
						if (/trident/i.test(t[1]))
							return (
								(e = /\brv[ :]+(\d+)/g.exec(n) || []), "IE " + (e[1] || "")
							);
						if (
							"Chrome" === t[1] &&
							null != (e = n.match(/\b(OPR|Edge|UBrowser)\/(\d+)/))
						)
							return e
								.slice(1)
								.join(" ")
								.replace("OPR", "Opera")
								.replace("UBrowser", "UC")
								.toLowerCase();
						if ("fbav" === t[1].toLowerCase() && ((t[1] = "facebook"), t[2]))
							return "facebook " + t[2];
						var i = t[2]
							? [t[1], t[2]]
							: [navigator.appName, navigator.appVersion, "-?"];
						return (
							null != (e = n.match(/version\/(\d+)/i)) && i.splice(1, 1, e[1]),
							i.join(" ").toLowerCase()
						);
					}),
					(e.getDeviceModel = () => "unknown"),
					(e.getDeviceManufacturer = () => "unknown"),
					(e.matchItem = (e, n) => {
						var i,
							r,
							s,
							o,
							a,
							u = new t("unknown", "0.0.0"),
							c = 0,
							d = 0;
						for (c = 0; c < n.length; c += 1)
							if (((i = new RegExp(n[c].value, "i")), i.test(e))) {
								if (
									((r = new RegExp(n[c].version + "[- /:;]([\\d._]+)", "i")),
									(s = e.match(r)),
									(a = ""),
									s && s[1] && (o = s[1]),
									o)
								) {
									var l = o.split(/[._]+/);
									for (d = 0; d < Math.min(l.length, 3); d += 1)
										a += l[d] + (d < Math.min(l.length, 3) - 1 ? "." : "");
								} else a = "0.0.0";
								return (u.name = n[c].name), (u.version = a), u;
							}
						return u;
					}),
					e
				);
			})();
			(i.sdkWrapperVersion = "javascript 2.1.2"),
				(i.osVersionPair = i.matchItem(
					[
						navigator.platform,
						navigator.userAgent,
						navigator.appVersion,
						navigator.vendor,
						window.opera,
					].join(" "),
					[
						new n("windows_phone", "Windows Phone", "OS"),
						new n("windows", "Win", "NT"),
						new n("ios", "iPhone", "OS"),
						new n("ios", "iPad", "OS"),
						new n("ios", "iPod", "OS"),
						new n("android", "Android", "Android"),
						new n("blackBerry", "BlackBerry", "/"),
						new n("mac_osx", "Mac", "OS X"),
						new n("tizen", "Tizen", "Tizen"),
						new n("linux", "Linux", "rv"),
					],
				)),
				(i.buildPlatform = i.runtimePlatformToString()),
				(i.deviceModel = i.getDeviceModel()),
				(i.deviceManufacturer = i.getDeviceManufacturer()),
				(i.osVersion = i.getOSVersionString()),
				(i.browserVersion = i.getBrowserVersionString()),
				(i.maxSafeInteger = Math.pow(2, 53) - 1),
				(e.GADevice = i);
		})(e.device || (e.device = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		!((e) => {
			var n = (() => {
				function e(n) {
					(this.deadline = n),
						(this.ignore = !1),
						(this.async = !1),
						(this.running = !1),
						(this.id = ++e.idCounter);
				}
				return e;
			})();
			(n.idCounter = 0), (e.TimedBlock = n);
		})(e.threading || (e.threading = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		!((e) => {
			var n = (() => {
				function e(e) {
					(this.comparer = e), (this._subQueues = {}), (this._sortedKeys = []);
				}
				return (
					(e.prototype.enqueue = function (e, n) {
						-1 === this._sortedKeys.indexOf(e) && this.addQueueOfPriority(e),
							this._subQueues[e].push(n);
					}),
					(e.prototype.addQueueOfPriority = function (e) {
						this._sortedKeys.push(e),
							this._sortedKeys.sort((e, t) => this.comparer.compare(e, t)),
							(this._subQueues[e] = []);
					}),
					(e.prototype.peek = function () {
						if (this.hasItems()) return this._subQueues[this._sortedKeys[0]][0];
						throw new Error("The queue is empty");
					}),
					(e.prototype.hasItems = function () {
						return this._sortedKeys.length > 0;
					}),
					(e.prototype.dequeue = function () {
						if (this.hasItems()) return this.dequeueFromHighPriorityQueue();
						throw new Error("The queue is empty");
					}),
					(e.prototype.dequeueFromHighPriorityQueue = function () {
						var e = this._sortedKeys[0],
							n = this._subQueues[e].shift();
						return (
							0 === this._subQueues[e].length &&
								(this._sortedKeys.shift(), delete this._subQueues[e]),
							n
						);
					}),
					e
				);
			})();
			e.PriorityQueue = n;
		})(e.threading || (e.threading = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		!((n) => {
			var t,
				i = e.logging.GALogger;
			!((e) => {
				(e[(e.Equal = 0)] = "Equal"),
					(e[(e.LessOrEqual = 1)] = "LessOrEqual"),
					(e[(e.NotEqual = 2)] = "NotEqual");
			})((t = n.EGAStoreArgsOperator || (n.EGAStoreArgsOperator = {})));
			var r;
			!((e) => {
				(e[(e.Events = 0)] = "Events"),
					(e[(e.Sessions = 1)] = "Sessions"),
					(e[(e.Progression = 2)] = "Progression");
			})((r = n.EGAStore || (n.EGAStore = {})));
			var s = (() => {
				function e() {
					(this.eventsStore = []),
						(this.sessionsStore = []),
						(this.progressionStore = []),
						(this.storeItems = {});
					try {
						"object" == typeof localStorage
							? (localStorage.setItem("testingLocalStorage", "yes"),
								localStorage.removeItem("testingLocalStorage"),
								(e.storageAvailable = !0))
							: (e.storageAvailable = !1);
					} catch (e) {}
				}
				return (
					(e.isStorageAvailable = () => e.storageAvailable),
					(e.isStoreTooLargeForEvents = () =>
						e.instance.eventsStore.length + e.instance.sessionsStore.length >
						e.MaxNumberOfEntries),
					(e.select = (n, i, r, s) => {
						void 0 === i && (i = []),
							void 0 === r && (r = !1),
							void 0 === s && (s = 0);
						var o = e.getStore(n);
						if (!o) return null;
						for (var a = [], u = 0; u < o.length; ++u) {
							for (var c = o[u], d = !0, l = 0; l < i.length; ++l) {
								var f = i[l];
								if (c[f[0]])
									switch (f[1]) {
										case t.Equal:
											d = c[f[0]] == f[2];
											break;
										case t.LessOrEqual:
											d = c[f[0]] <= f[2];
											break;
										case t.NotEqual:
											d = c[f[0]] != f[2];
											break;
										default:
											d = !1;
									}
								else d = !1;
								if (!d) break;
							}
							d && a.push(c);
						}
						return (
							r && a.sort((e, n) => e.client_ts - n.client_ts),
							s > 0 && a.length > s && (a = a.slice(0, s + 1)),
							a
						);
					}),
					(e.update = (n, i, r) => {
						void 0 === r && (r = []);
						var s = e.getStore(n);
						if (!s) return !1;
						for (var o = 0; o < s.length; ++o) {
							for (var a = s[o], u = !0, c = 0; c < r.length; ++c) {
								var d = r[c];
								if (a[d[0]])
									switch (d[1]) {
										case t.Equal:
											u = a[d[0]] == d[2];
											break;
										case t.LessOrEqual:
											u = a[d[0]] <= d[2];
											break;
										case t.NotEqual:
											u = a[d[0]] != d[2];
											break;
										default:
											u = !1;
									}
								else u = !1;
								if (!u) break;
							}
							if (u)
								for (var c = 0; c < i.length; ++c) {
									var l = i[c];
									a[l[0]] = l[1];
								}
						}
						return !0;
					}),
					(e.delete = (n, i) => {
						var r = e.getStore(n);
						if (r)
							for (var s = 0; s < r.length; ++s) {
								for (var o = r[s], a = !0, u = 0; u < i.length; ++u) {
									var c = i[u];
									if (o[c[0]])
										switch (c[1]) {
											case t.Equal:
												a = o[c[0]] == c[2];
												break;
											case t.LessOrEqual:
												a = o[c[0]] <= c[2];
												break;
											case t.NotEqual:
												a = o[c[0]] != c[2];
												break;
											default:
												a = !1;
										}
									else a = !1;
									if (!a) break;
								}
								a && (r.splice(s, 1), --s);
							}
					}),
					(e.insert = (n, t, i, r) => {
						void 0 === i && (i = !1), void 0 === r && (r = null);
						var s = e.getStore(n);
						if (s)
							if (i) {
								if (!r) return;
								for (var o = !1, a = 0; a < s.length; ++a) {
									var u = s[a];
									if (u[r] == t[r]) {
										for (var c in t) u[c] = t[c];
										o = !0;
										break;
									}
								}
								o || s.push(t);
							} else s.push(t);
					}),
					(e.save = () => {
						if (!e.isStorageAvailable())
							return void i.w("Storage is not available, cannot save.");
						localStorage.setItem(
							e.KeyPrefix + e.EventsStoreKey,
							JSON.stringify(e.instance.eventsStore),
						),
							localStorage.setItem(
								e.KeyPrefix + e.SessionsStoreKey,
								JSON.stringify(e.instance.sessionsStore),
							),
							localStorage.setItem(
								e.KeyPrefix + e.ProgressionStoreKey,
								JSON.stringify(e.instance.progressionStore),
							),
							localStorage.setItem(
								e.KeyPrefix + e.ItemsStoreKey,
								JSON.stringify(e.instance.storeItems),
							);
					}),
					(e.load = () => {
						if (!e.isStorageAvailable())
							return void i.w("Storage is not available, cannot load.");
						try {
							(e.instance.eventsStore = JSON.parse(
								localStorage.getItem(e.KeyPrefix + e.EventsStoreKey),
							)),
								e.instance.eventsStore || (e.instance.eventsStore = []);
						} catch (n) {
							i.w("Load failed for 'events' store. Using empty store."),
								(e.instance.eventsStore = []);
						}
						try {
							(e.instance.sessionsStore = JSON.parse(
								localStorage.getItem(e.KeyPrefix + e.SessionsStoreKey),
							)),
								e.instance.sessionsStore || (e.instance.sessionsStore = []);
						} catch (n) {
							i.w("Load failed for 'sessions' store. Using empty store."),
								(e.instance.sessionsStore = []);
						}
						try {
							(e.instance.progressionStore = JSON.parse(
								localStorage.getItem(e.KeyPrefix + e.ProgressionStoreKey),
							)),
								e.instance.progressionStore ||
									(e.instance.progressionStore = []);
						} catch (n) {
							i.w("Load failed for 'progression' store. Using empty store."),
								(e.instance.progressionStore = []);
						}
						try {
							(e.instance.storeItems = JSON.parse(
								localStorage.getItem(e.KeyPrefix + e.ItemsStoreKey),
							)),
								e.instance.storeItems || (e.instance.storeItems = {});
						} catch (n) {
							i.w("Load failed for 'items' store. Using empty store."),
								(e.instance.progressionStore = []);
						}
					}),
					(e.setItem = (n, t) => {
						var i = e.KeyPrefix + n;
						t
							? (e.instance.storeItems[i] = t)
							: i in e.instance.storeItems && delete e.instance.storeItems[i];
					}),
					(e.getItem = (n) => {
						var t = e.KeyPrefix + n;
						return t in e.instance.storeItems ? e.instance.storeItems[t] : null;
					}),
					(e.getStore = (n) => {
						switch (n) {
							case r.Events:
								return e.instance.eventsStore;
							case r.Sessions:
								return e.instance.sessionsStore;
							case r.Progression:
								return e.instance.progressionStore;
							default:
								return i.w("GAStore.getStore(): Cannot find store: " + n), null;
						}
					}),
					e
				);
			})();
			(s.instance = new s()),
				(s.MaxNumberOfEntries = 2e3),
				(s.KeyPrefix = "GA::"),
				(s.EventsStoreKey = "ga_event"),
				(s.SessionsStoreKey = "ga_session"),
				(s.ProgressionStoreKey = "ga_progression"),
				(s.ItemsStoreKey = "ga_items"),
				(n.GAStore = s);
		})(e.store || (e.store = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		!((n) => {
			var t = e.validators.GAValidator,
				i = e.utilities.GAUtilities,
				r = e.logging.GALogger,
				s = e.store.GAStore,
				o = e.device.GADevice,
				a = e.store.EGAStore,
				u = e.store.EGAStoreArgsOperator,
				c = (() => {
					function n() {
						(this.availableCustomDimensions01 = []),
							(this.availableCustomDimensions02 = []),
							(this.availableCustomDimensions03 = []),
							(this.availableResourceCurrencies = []),
							(this.availableResourceItemTypes = []),
							(this.sdkConfigDefault = {}),
							(this.sdkConfig = {}),
							(this.progressionTries = {});
					}
					return (
						(n.setUserId = (e) => {
							(n.instance.userId = e), n.cacheIdentifier();
						}),
						(n.getIdentifier = () => n.instance.identifier),
						(n.isInitialized = () => n.instance.initialized),
						(n.setInitialized = (e) => {
							n.instance.initialized = e;
						}),
						(n.getSessionStart = () => n.instance.sessionStart),
						(n.getSessionNum = () => n.instance.sessionNum),
						(n.getTransactionNum = () => n.instance.transactionNum),
						(n.getSessionId = () => n.instance.sessionId),
						(n.getCurrentCustomDimension01 = () =>
							n.instance.currentCustomDimension01),
						(n.getCurrentCustomDimension02 = () =>
							n.instance.currentCustomDimension02),
						(n.getCurrentCustomDimension03 = () =>
							n.instance.currentCustomDimension03),
						(n.getGameKey = () => n.instance.gameKey),
						(n.getGameSecret = () => n.instance.gameSecret),
						(n.getAvailableCustomDimensions01 = () =>
							n.instance.availableCustomDimensions01),
						(n.setAvailableCustomDimensions01 = (e) => {
							t.validateCustomDimensions(e) &&
								((n.instance.availableCustomDimensions01 = e),
								n.validateAndFixCurrentDimensions(),
								r.i(
									"Set available custom01 dimension values: (" +
										i.joinStringArray(e, ", ") +
										")",
								));
						}),
						(n.getAvailableCustomDimensions02 = () =>
							n.instance.availableCustomDimensions02),
						(n.setAvailableCustomDimensions02 = (e) => {
							t.validateCustomDimensions(e) &&
								((n.instance.availableCustomDimensions02 = e),
								n.validateAndFixCurrentDimensions(),
								r.i(
									"Set available custom02 dimension values: (" +
										i.joinStringArray(e, ", ") +
										")",
								));
						}),
						(n.getAvailableCustomDimensions03 = () =>
							n.instance.availableCustomDimensions03),
						(n.setAvailableCustomDimensions03 = (e) => {
							t.validateCustomDimensions(e) &&
								((n.instance.availableCustomDimensions03 = e),
								n.validateAndFixCurrentDimensions(),
								r.i(
									"Set available custom03 dimension values: (" +
										i.joinStringArray(e, ", ") +
										")",
								));
						}),
						(n.getAvailableResourceCurrencies = () =>
							n.instance.availableResourceCurrencies),
						(n.setAvailableResourceCurrencies = (e) => {
							t.validateResourceCurrencies(e) &&
								((n.instance.availableResourceCurrencies = e),
								r.i(
									"Set available resource currencies: (" +
										i.joinStringArray(e, ", ") +
										")",
								));
						}),
						(n.getAvailableResourceItemTypes = () =>
							n.instance.availableResourceItemTypes),
						(n.setAvailableResourceItemTypes = (e) => {
							t.validateResourceItemTypes(e) &&
								((n.instance.availableResourceItemTypes = e),
								r.i(
									"Set available resource item types: (" +
										i.joinStringArray(e, ", ") +
										")",
								));
						}),
						(n.getBuild = () => n.instance.build),
						(n.setBuild = (e) => {
							(n.instance.build = e), r.i("Set build version: " + e);
						}),
						(n.getUseManualSessionHandling = () =>
							n.instance.useManualSessionHandling),
						(n.prototype.setDefaultId = function (e) {
							(this.defaultUserId = e || ""), n.cacheIdentifier();
						}),
						(n.getDefaultId = () => n.instance.defaultUserId),
						(n.getSdkConfig = () => {
							var e,
								t = 0;
							for (var i in n.instance.sdkConfig) 0 === t && (e = i), ++t;
							if (e && t > 0) return n.instance.sdkConfig;
							var e,
								t = 0;
							for (var i in n.instance.sdkConfigCached) 0 === t && (e = i), ++t;
							return e && t > 0
								? n.instance.sdkConfigCached
								: n.instance.sdkConfigDefault;
						}),
						(n.isEnabled = () => {
							var e = n.getSdkConfig();
							return (
								(!e.enabled || "false" != e.enabled) &&
								!!n.instance.initAuthorized
							);
						}),
						(n.setCustomDimension01 = (e) => {
							(n.instance.currentCustomDimension01 = e),
								s.setItem(n.Dimension01Key, e),
								r.i("Set custom01 dimension value: " + e);
						}),
						(n.setCustomDimension02 = (e) => {
							(n.instance.currentCustomDimension02 = e),
								s.setItem(n.Dimension02Key, e),
								r.i("Set custom02 dimension value: " + e);
						}),
						(n.setCustomDimension03 = (e) => {
							(n.instance.currentCustomDimension03 = e),
								s.setItem(n.Dimension03Key, e),
								r.i("Set custom03 dimension value: " + e);
						}),
						(n.setFacebookId = (e) => {
							(n.instance.facebookId = e),
								s.setItem(n.FacebookIdKey, e),
								r.i("Set facebook id: " + e);
						}),
						(n.setGender = (t) => {
							(n.instance.gender = isNaN(Number(e.EGAGender[t]))
								? e.EGAGender[t].toString().toLowerCase()
								: e.EGAGender[e.EGAGender[t]].toString().toLowerCase()),
								s.setItem(n.GenderKey, n.instance.gender),
								r.i("Set gender: " + n.instance.gender);
						}),
						(n.setBirthYear = (e) => {
							(n.instance.birthYear = e),
								s.setItem(n.BirthYearKey, e.toString()),
								r.i("Set birth year: " + e);
						}),
						(n.incrementSessionNum = () => {
							var e = n.getSessionNum() + 1;
							n.instance.sessionNum = e;
						}),
						(n.incrementTransactionNum = () => {
							var e = n.getTransactionNum() + 1;
							n.instance.transactionNum = e;
						}),
						(n.incrementProgressionTries = (e) => {
							var t = n.getProgressionTries(e) + 1;
							n.instance.progressionTries[e] = t;
							var i = {};
							(i.progression = e),
								(i.tries = t),
								s.insert(a.Progression, i, !0, "progression");
						}),
						(n.getProgressionTries = (e) =>
							e in n.instance.progressionTries
								? n.instance.progressionTries[e]
								: 0),
						(n.clearProgressionTries = (e) => {
							e in n.instance.progressionTries &&
								delete n.instance.progressionTries[e];
							var t = [];
							t.push(["progression", u.Equal, e]), s.delete(a.Progression, t);
						}),
						(n.setKeys = (e, t) => {
							(n.instance.gameKey = e), (n.instance.gameSecret = t);
						}),
						(n.setManualSessionHandling = (e) => {
							(n.instance.useManualSessionHandling = e),
								r.i("Use manual session handling: " + e);
						}),
						(n.getEventAnnotations = () => {
							var e = {};
							(e.v = 2),
								(e.user_id = n.instance.identifier),
								(e.client_ts = n.getClientTsAdjusted()),
								(e.sdk_version = o.getRelevantSdkVersion()),
								(e.os_version = o.osVersion),
								(e.manufacturer = o.deviceManufacturer),
								(e.device = o.deviceModel),
								(e.browser_version = o.browserVersion),
								(e.platform = o.buildPlatform),
								(e.session_id = n.instance.sessionId),
								(e[n.SessionNumKey] = n.instance.sessionNum);
							var i = o.getConnectionType();
							return (
								t.validateConnectionType(i) && (e.connection_type = i),
								o.gameEngineVersion && (e.engine_version = o.gameEngineVersion),
								n.instance.build && (e.build = n.instance.build),
								n.instance.facebookId &&
									(e[n.FacebookIdKey] = n.instance.facebookId),
								n.instance.gender && (e[n.GenderKey] = n.instance.gender),
								0 != n.instance.birthYear &&
									(e[n.BirthYearKey] = n.instance.birthYear),
								e
							);
						}),
						(n.getSdkErrorEventAnnotations = () => {
							var e = {};
							(e.v = 2),
								(e.category = n.CategorySdkError),
								(e.sdk_version = o.getRelevantSdkVersion()),
								(e.os_version = o.osVersion),
								(e.manufacturer = o.deviceManufacturer),
								(e.device = o.deviceModel),
								(e.platform = o.buildPlatform);
							var i = o.getConnectionType();
							return (
								t.validateConnectionType(i) && (e.connection_type = i),
								o.gameEngineVersion && (e.engine_version = o.gameEngineVersion),
								e
							);
						}),
						(n.getInitAnnotations = () => {
							var e = {};
							return (
								(e.sdk_version = o.getRelevantSdkVersion()),
								(e.os_version = o.osVersion),
								(e.platform = o.buildPlatform),
								e
							);
						}),
						(n.getClientTsAdjusted = () => {
							var e = i.timeIntervalSince1970(),
								r = e + n.instance.clientServerTimeOffset;
							return t.validateClientTs(r) ? r : e;
						}),
						(n.sessionIsStarted = () => 0 != n.instance.sessionStart),
						(n.cacheIdentifier = () => {
							n.instance.userId
								? (n.instance.identifier = n.instance.userId)
								: n.instance.defaultUserId &&
									(n.instance.identifier = n.instance.defaultUserId);
						}),
						(n.ensurePersistedStates = () => {
							s.isStorageAvailable() && s.load();
							var e = n.instance;
							e.setDefaultId(
								null != s.getItem(n.DefaultUserIdKey)
									? s.getItem(n.DefaultUserIdKey)
									: i.createGuid(),
							),
								(e.sessionNum =
									null != s.getItem(n.SessionNumKey)
										? Number(s.getItem(n.SessionNumKey))
										: 0),
								(e.transactionNum =
									null != s.getItem(n.TransactionNumKey)
										? Number(s.getItem(n.TransactionNumKey))
										: 0),
								e.facebookId
									? s.setItem(n.FacebookIdKey, e.facebookId)
									: ((e.facebookId =
											null != s.getItem(n.FacebookIdKey)
												? s.getItem(n.FacebookIdKey)
												: ""),
										e.facebookId),
								e.gender
									? s.setItem(n.GenderKey, e.gender)
									: ((e.gender =
											null != s.getItem(n.GenderKey)
												? s.getItem(n.GenderKey)
												: ""),
										e.gender),
								e.birthYear && 0 != e.birthYear
									? s.setItem(n.BirthYearKey, e.birthYear.toString())
									: ((e.birthYear =
											null != s.getItem(n.BirthYearKey)
												? Number(s.getItem(n.BirthYearKey))
												: 0),
										e.birthYear),
								e.currentCustomDimension01
									? s.setItem(n.Dimension01Key, e.currentCustomDimension01)
									: ((e.currentCustomDimension01 =
											null != s.getItem(n.Dimension01Key)
												? s.getItem(n.Dimension01Key)
												: ""),
										e.currentCustomDimension01),
								e.currentCustomDimension02
									? s.setItem(n.Dimension02Key, e.currentCustomDimension02)
									: ((e.currentCustomDimension02 =
											null != s.getItem(n.Dimension02Key)
												? s.getItem(n.Dimension02Key)
												: ""),
										e.currentCustomDimension02),
								e.currentCustomDimension03
									? s.setItem(n.Dimension03Key, e.currentCustomDimension03)
									: ((e.currentCustomDimension03 =
											null != s.getItem(n.Dimension03Key)
												? s.getItem(n.Dimension03Key)
												: ""),
										e.currentCustomDimension03);
							var t =
								null != s.getItem(n.SdkConfigCachedKey)
									? s.getItem(n.SdkConfigCachedKey)
									: "";
							if (t) {
								var r = JSON.parse(i.decode64(t));
								r && (e.sdkConfigCached = r);
							}
							var o = s.select(a.Progression);
							if (o)
								for (var u = 0; u < o.length; ++u) {
									var c = o[u];
									c && (e.progressionTries[c.progression] = c.tries);
								}
						}),
						(n.calculateServerTimeOffset = (e) =>
							e - i.timeIntervalSince1970()),
						(n.validateAndFixCurrentDimensions = () => {
							t.validateDimension01(
								n.getCurrentCustomDimension01(),
								n.getAvailableCustomDimensions01(),
							) || n.setCustomDimension01(""),
								t.validateDimension02(
									n.getCurrentCustomDimension02(),
									n.getAvailableCustomDimensions02(),
								) || n.setCustomDimension02(""),
								t.validateDimension03(
									n.getCurrentCustomDimension03(),
									n.getAvailableCustomDimensions03(),
								) || n.setCustomDimension03("");
						}),
						n
					);
				})();
			(c.CategorySdkError = "sdk_error"),
				(c.instance = new c()),
				(c.DefaultUserIdKey = "default_user_id"),
				(c.SessionNumKey = "session_num"),
				(c.TransactionNumKey = "transaction_num"),
				(c.FacebookIdKey = "facebook_id"),
				(c.GenderKey = "gender"),
				(c.BirthYearKey = "birth_year"),
				(c.Dimension01Key = "dimension01"),
				(c.Dimension02Key = "dimension02"),
				(c.Dimension03Key = "dimension03"),
				(c.SdkConfigCachedKey = "sdk_config_cached"),
				(n.GAState = c);
		})(e.state || (e.state = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		!((n) => {
			var t = e.utilities.GAUtilities,
				i = e.logging.GALogger,
				r = (() => {
					function e() {}
					return (
						(e.execute = (n, r, s, o) => {
							if (
								(e.countMap[r] || (e.countMap[r] = 0),
								!(e.countMap[r] >= e.MaxCount))
							) {
								var a = t.getHmac(o, s),
									u = new XMLHttpRequest();
								(u.onreadystatechange = () => {
									if (4 === u.readyState) {
										if (!u.responseText) return;
										if (200 != u.status)
											return void i.w(
												"sdk error failed. response code not 200. status code: " +
													u.status +
													", description: " +
													u.statusText +
													", body: " +
													u.responseText,
											);
										e.countMap[r] = e.countMap[r] + 1;
									}
								}),
									u.open("POST", n, !0),
									u.setRequestHeader("Content-Type", "application/json"),
									u.setRequestHeader("Authorization", a);
								try {
									u.send(s);
								} catch (e) {
									console.error(e);
								}
							}
						}),
						e
					);
				})();
			(r.MaxCount = 10), (r.countMap = {}), (n.SdkErrorTask = r);
		})(e.tasks || (e.tasks = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		!((n) => {
			var t = e.state.GAState,
				i = e.logging.GALogger,
				r = e.utilities.GAUtilities,
				s = e.validators.GAValidator,
				o = e.tasks.SdkErrorTask,
				a = (() => {
					function e() {
						(this.protocol = "https"),
							(this.hostName = "api.gameanalytics.com"),
							(this.version = "v2"),
							(this.baseUrl =
								this.protocol + "://" + this.hostName + "/" + this.version),
							(this.initializeUrlPath = "init"),
							(this.eventsUrlPath = "events"),
							(this.useGzip = !1);
					}
					return (
						(e.prototype.requestInit = function (i) {
							var r = t.getGameKey(),
								s = this.baseUrl + "/" + r + "/" + this.initializeUrlPath,
								o = t.getInitAnnotations(),
								a = JSON.stringify(o);
							if (!a)
								return void i(n.EGAHTTPApiResponse.JsonEncodeFailed, null);
							var u = this.createPayloadData(a, this.useGzip),
								c = [];
							c.push(a),
								e.sendRequest(s, u, c, this.useGzip, e.initRequestCallback, i);
						}),
						(e.prototype.sendEventsInArray = function (i, r, s) {
							if (0 != i.length) {
								var o = t.getGameKey(),
									a = this.baseUrl + "/" + o + "/" + this.eventsUrlPath,
									u = JSON.stringify(i);
								if (!u)
									return void s(
										n.EGAHTTPApiResponse.JsonEncodeFailed,
										null,
										r,
										i.length,
									);
								var c = this.createPayloadData(u, this.useGzip),
									d = [];
								d.push(u),
									d.push(r),
									d.push(i.length.toString()),
									e.sendRequest(
										a,
										c,
										d,
										this.useGzip,
										e.sendEventInArrayRequestCallback,
										s,
									);
							}
						}),
						(e.prototype.sendSdkErrorEvent = function (n) {
							var r = t.getGameKey(),
								a = t.getGameSecret();
							if (s.validateSdkErrorEvent(r, a, n)) {
								var u = this.baseUrl + "/" + r + "/" + this.eventsUrlPath,
									c = "",
									d = t.getSdkErrorEventAnnotations(),
									l = e.sdkErrorTypeToString(n);
								d.type = l;
								var f = [];
								if ((f.push(d), !(c = JSON.stringify(f))))
									return void i.w("sendSdkErrorEvent: JSON encoding failed.");
								o.execute(u, n, c, a);
							}
						}),
						(e.sendEventInArrayRequestCallback = (t, i, r, s) => {
							void 0 === s && (s = null);
							var o = (s[0], s[1], s[2]),
								a = Number.parseInt(s[3]),
								u = "",
								c = 0;
							(u = t.responseText), (c = t.status);
							var d = e.instance.processRequestResponse(
								c,
								t.statusText,
								u,
								"Events",
							);
							if (
								d != n.EGAHTTPApiResponse.Ok &&
								d != n.EGAHTTPApiResponse.BadRequest
							)
								return void r(d, null, o, a);
							var l = u ? JSON.parse(u) : {};
							if (null == l)
								return void r(
									n.EGAHTTPApiResponse.JsonDecodeFailed,
									null,
									o,
									a,
								);
							n.EGAHTTPApiResponse.BadRequest, r(d, l, o, a);
						}),
						(e.sendRequest = (e, n, i, s, o, a) => {
							var u = new XMLHttpRequest(),
								c = t.getGameSecret(),
								d = r.getHmac(c, n),
								l = [];
							l.push(d);
							for (var f in i) l.push(i[f]);
							if (
								((u.onreadystatechange = () => {
									4 === u.readyState && o(u, e, a, l);
								}),
								u.open("POST", e, !0),
								u.setRequestHeader("Content-Type", "text/plain"),
								u.setRequestHeader("Authorization", d),
								s)
							)
								throw new Error("gzip not supported");
							try {
								u.send(n);
							} catch (e) {
								console.error(e.stack);
							}
						}),
						(e.initRequestCallback = (t, i, r, o) => {
							void 0 === o && (o = null);
							var a = (o[0], o[1], ""),
								u = 0;
							(a = t.responseText), (u = t.status);
							var c = a ? JSON.parse(a) : {},
								d = e.instance.processRequestResponse(
									u,
									t.statusText,
									a,
									"Init",
								);
							if (
								d != n.EGAHTTPApiResponse.Ok &&
								d != n.EGAHTTPApiResponse.BadRequest
							)
								return void r(d, null);
							if (null == c)
								return void r(n.EGAHTTPApiResponse.JsonDecodeFailed, null);
							if (d === n.EGAHTTPApiResponse.BadRequest) return void r(d, null);
							var l = s.validateAndCleanInitRequestResponse(c);
							if (!l) return void r(n.EGAHTTPApiResponse.BadResponse, null);
							r(n.EGAHTTPApiResponse.Ok, l);
						}),
						(e.prototype.createPayloadData = (e, n) => {
							if (n) throw new Error("gzip not supported");
							return e;
						}),
						(e.prototype.processRequestResponse = (e, t, i, r) =>
							i
								? 200 === e
									? n.EGAHTTPApiResponse.Ok
									: 0 === e || 401 === e
										? n.EGAHTTPApiResponse.Unauthorized
										: 400 === e
											? n.EGAHTTPApiResponse.BadRequest
											: 500 === e
												? n.EGAHTTPApiResponse.InternalServerError
												: n.EGAHTTPApiResponse.UnknownResponseCode
								: n.EGAHTTPApiResponse.NoResponse),
						(e.sdkErrorTypeToString = (e) => {
							switch (e) {
								case n.EGASdkErrorType.Rejected:
									return "rejected";
								default:
									return "";
							}
						}),
						e
					);
				})();
			(a.instance = new a()), (n.GAHTTPApi = a);
		})(e.http || (e.http = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		!((n) => {
			var t = e.store.GAStore,
				i = e.store.EGAStore,
				r = e.store.EGAStoreArgsOperator,
				s = e.state.GAState,
				o = e.logging.GALogger,
				a = e.utilities.GAUtilities,
				u = e.http.EGAHTTPApiResponse,
				c = e.http.GAHTTPApi,
				d = e.validators.GAValidator,
				l = e.http.EGASdkErrorType,
				f = (() => {
					function n() {}
					return (
						(n.addSessionStartEvent = () => {
							var e = {};
							(e.category = n.CategorySessionStart),
								s.incrementSessionNum(),
								t.setItem(s.SessionNumKey, s.getSessionNum().toString()),
								n.addDimensionsToEvent(e),
								n.addEventToStore(e),
								o.i("Add SESSION START event"),
								n.processEvents(n.CategorySessionStart, !1);
						}),
						(n.addSessionEndEvent = () => {
							var e = s.getSessionStart(),
								t = s.getClientTsAdjusted(),
								i = t - e;
							i < 0 &&
								(o.w(
									"Session length was calculated to be less then 0. Should not be possible. Resetting to 0.",
								),
								(i = 0));
							var r = {};
							(r.category = n.CategorySessionEnd),
								(r.length = i),
								n.addDimensionsToEvent(r),
								n.addEventToStore(r),
								o.i("Add SESSION END event."),
								n.processEvents("", !1);
						}),
						(n.addBusinessEvent = (e, i, r, a, u) => {
							if (
								(void 0 === u && (u = null),
								!d.validateBusinessEvent(e, i, u, r, a))
							)
								return void c.instance.sendSdkErrorEvent(l.Rejected);
							var f = {};
							s.incrementTransactionNum(),
								t.setItem(
									s.TransactionNumKey,
									s.getTransactionNum().toString(),
								),
								(f.event_id = r + ":" + a),
								(f.category = n.CategoryBusiness),
								(f.currency = e),
								(f.amount = i),
								(f[s.TransactionNumKey] = s.getTransactionNum()),
								u && (f.cart_type = u),
								n.addDimensionsToEvent(f),
								o.i(
									"Add BUSINESS event: {currency:" +
										e +
										", amount:" +
										i +
										", itemType:" +
										r +
										", itemId:" +
										a +
										", cartType:" +
										u +
										"}",
								),
								n.addEventToStore(f);
						}),
						(n.addResourceEvent = (t, i, r, a, u) => {
							if (
								!d.validateResourceEvent(
									t,
									i,
									r,
									a,
									u,
									s.getAvailableResourceCurrencies(),
									s.getAvailableResourceItemTypes(),
								)
							)
								return void c.instance.sendSdkErrorEvent(l.Rejected);
							t === e.EGAResourceFlowType.Sink && (r *= -1);
							var f = {},
								v = n.resourceFlowTypeToString(t);
							(f.event_id = v + ":" + i + ":" + a + ":" + u),
								(f.category = n.CategoryResource),
								(f.amount = r),
								n.addDimensionsToEvent(f),
								o.i(
									"Add RESOURCE event: {currency:" +
										i +
										", amount:" +
										r +
										", itemType:" +
										a +
										", itemId:" +
										u +
										"}",
								),
								n.addEventToStore(f);
						}),
						(n.addProgressionEvent = (t, i, r, a, u, f) => {
							var v = n.progressionStatusToString(t);
							if (!d.validateProgressionEvent(t, i, r, a))
								return void c.instance.sendSdkErrorEvent(l.Rejected);
							var g,
								m = {};
							(g = r ? (a ? i + ":" + r + ":" + a : i + ":" + r) : i),
								(m.category = n.CategoryProgression),
								(m.event_id = v + ":" + g);
							var p = 0;
							f && t != e.EGAProgressionStatus.Start && (m.score = u),
								t === e.EGAProgressionStatus.Fail &&
									s.incrementProgressionTries(g),
								t === e.EGAProgressionStatus.Complete &&
									(s.incrementProgressionTries(g),
									(p = s.getProgressionTries(g)),
									(m.attempt_num = p),
									s.clearProgressionTries(g)),
								n.addDimensionsToEvent(m),
								o.i(
									"Add PROGRESSION event: {status:" +
										v +
										", progression01:" +
										i +
										", progression02:" +
										r +
										", progression03:" +
										a +
										", score:" +
										u +
										", attempt:" +
										p +
										"}",
								),
								n.addEventToStore(m);
						}),
						(n.addDesignEvent = (e, t, i) => {
							if (!d.validateDesignEvent(e, t))
								return void c.instance.sendSdkErrorEvent(l.Rejected);
							var r = {};
							(r.category = n.CategoryDesign),
								(r.event_id = e),
								i && (r.value = t),
								o.i("Add DESIGN event: {eventId:" + e + ", value:" + t + "}"),
								n.addEventToStore(r);
						}),
						(n.addErrorEvent = (e, t) => {
							var i = n.errorSeverityToString(e);
							if (!d.validateErrorEvent(e, t))
								return void c.instance.sendSdkErrorEvent(l.Rejected);
							var r = {};
							(r.category = n.CategoryError),
								(r.severity = i),
								(r.message = t),
								o.i("Add ERROR event: {severity:" + i + ", message:" + t + "}"),
								n.addEventToStore(r);
						}),
						(n.processEvents = (e, s) => {
							try {
								var u = a.createGuid();
								s && (n.cleanupEvents(), n.fixMissingSessionEndEvents());
								var d = [];
								d.push(["status", r.Equal, "new"]);
								var l = [];
								l.push(["status", r.Equal, "new"]),
									e &&
										(d.push(["category", r.Equal, e]),
										l.push(["category", r.Equal, e]));
								var f = [];
								f.push(["status", u]);
								var v = t.select(i.Events, d);
								if (!v || 0 == v.length)
									return void o.i("Event queue: No events to send");
								if (v.length > n.MaxEventCount) {
									if (!(v = t.select(i.Events, d, !0, n.MaxEventCount))) return;
									var g = v[v.length - 1],
										m = g.client_ts;
									if (
										(d.push(["client_ts", r.LessOrEqual, m]),
										!(v = t.select(i.Events, d)))
									)
										return;
									l.push(["client_ts", r.LessOrEqual, m]);
								}
								if (
									(o.i("Event queue: Sending " + v.length + " events."),
									!t.update(i.Events, f, l))
								)
									return;
								for (var p = [], h = 0; h < v.length; ++h) {
									var y = v[h],
										S = JSON.parse(a.decode64(y.event));
									0 != S.length && p.push(S);
								}
								c.instance.sendEventsInArray(p, u, n.processEventsCallback);
							} catch (e) {
								o.e("Error during ProcessEvents(): " + e.stack);
							}
						}),
						(n.processEventsCallback = (e, s, a, c) => {
							var d = [];
							if ((d.push(["status", r.Equal, a]), e === u.Ok))
								t.delete(i.Events, d),
									o.i("Event queue: " + c + " events sent.");
							else if (e === u.NoResponse) {
								var l = [];
								l.push(["status", "new"]),
									o.w(
										"Event queue: Failed to send events to collector - Retrying next time",
									),
									t.update(i.Events, l, d);
							} else {
								if (s) {
									var f,
										v = 0;
									for (var g in s) 0 == v && (f = s[g]), ++v;
									e === u.BadRequest && f.constructor === Array
										? o.w(
												"Event queue: " +
													c +
													" events sent. " +
													v +
													" events failed GA server validation.",
											)
										: o.w("Event queue: Failed to send events.");
								} else o.w("Event queue: Failed to send events.");
								t.delete(i.Events, d);
							}
							n.updateSessionStore();
						}),
						(n.cleanupEvents = () => {
							t.update(i.Events, [["status", "new"]]);
						}),
						(n.fixMissingSessionEndEvents = () => {
							var e = [];
							e.push(["session_id", r.NotEqual, s.getSessionId()]);
							var u = t.select(i.Sessions, e);
							if (u && 0 != u.length) {
								o.i(
									u.length +
										" session(s) located with missing session_end event.",
								);
								for (var c = 0; c < u.length; ++c) {
									var d = JSON.parse(a.decode64(u[c].event)),
										l = d.client_ts,
										f = u[c].timestamp,
										v = l - f;
									(v = Math.max(0, v)),
										(d.category = n.CategorySessionEnd),
										(d.length = v),
										n.addEventToStore(d);
								}
							}
						}),
						(n.addEventToStore = (e) => {
							if (!s.isInitialized())
								return void o.w("Could not add event: SDK is not initialized");
							try {
								if (
									t.isStoreTooLargeForEvents() &&
									!a.stringMatch(e.category, /^(user|session_end|business)$/)
								)
									return void o.w(
										"Database too large. Event has been blocked.",
									);
								var u = s.getEventAnnotations(),
									c = a.encode64(JSON.stringify(u));
								for (var d in e) u[d] = e[d];
								var l = JSON.stringify(u);
								o.ii("Event added to queue: " + l);
								var f = {};
								(f.status = "new"),
									(f.category = u.category),
									(f.session_id = u.session_id),
									(f.client_ts = u.client_ts),
									(f.event = a.encode64(JSON.stringify(u))),
									t.insert(i.Events, f),
									e.category == n.CategorySessionEnd
										? t.delete(i.Sessions, [
												["session_id", r.Equal, u.session_id],
											])
										: ((f = {}),
											(f.session_id = u.session_id),
											(f.timestamp = s.getSessionStart()),
											(f.event = c),
											t.insert(i.Sessions, f, !0, "session_id")),
									t.isStorageAvailable() && t.save();
							} catch (d) {
								o.e("addEventToStore: error"), o.e(d.stack);
							}
						}),
						(n.updateSessionStore = () => {
							if (s.sessionIsStarted()) {
								var e = {};
								(e.session_id = s.instance.sessionId),
									(e.timestamp = s.getSessionStart()),
									(e.event = a.encode64(
										JSON.stringify(s.getEventAnnotations()),
									)),
									t.insert(i.Sessions, e, !0, "session_id"),
									t.isStorageAvailable() && t.save();
							}
						}),
						(n.addDimensionsToEvent = (e) => {
							e &&
								(s.getCurrentCustomDimension01() &&
									(e.custom_01 = s.getCurrentCustomDimension01()),
								s.getCurrentCustomDimension02() &&
									(e.custom_02 = s.getCurrentCustomDimension02()),
								s.getCurrentCustomDimension03() &&
									(e.custom_03 = s.getCurrentCustomDimension03()));
						}),
						(n.resourceFlowTypeToString = (n) =>
							n == e.EGAResourceFlowType.Source ||
							n == e.EGAResourceFlowType[e.EGAResourceFlowType.Source]
								? "Source"
								: n == e.EGAResourceFlowType.Sink ||
										n == e.EGAResourceFlowType[e.EGAResourceFlowType.Sink]
									? "Sink"
									: ""),
						(n.progressionStatusToString = (n) =>
							n == e.EGAProgressionStatus.Start ||
							n == e.EGAProgressionStatus[e.EGAProgressionStatus.Start]
								? "Start"
								: n == e.EGAProgressionStatus.Complete ||
										n == e.EGAProgressionStatus[e.EGAProgressionStatus.Complete]
									? "Complete"
									: n == e.EGAProgressionStatus.Fail ||
											n == e.EGAProgressionStatus[e.EGAProgressionStatus.Fail]
										? "Fail"
										: ""),
						(n.errorSeverityToString = (n) =>
							n == e.EGAErrorSeverity.Debug ||
							n == e.EGAErrorSeverity[e.EGAErrorSeverity.Debug]
								? "debug"
								: n == e.EGAErrorSeverity.Info ||
										n == e.EGAErrorSeverity[e.EGAErrorSeverity.Info]
									? "info"
									: n == e.EGAErrorSeverity.Warning ||
											n == e.EGAErrorSeverity[e.EGAErrorSeverity.Warning]
										? "warning"
										: n == e.EGAErrorSeverity.Error ||
												n == e.EGAErrorSeverity[e.EGAErrorSeverity.Error]
											? "error"
											: n == e.EGAErrorSeverity.Critical ||
													n == e.EGAErrorSeverity[e.EGAErrorSeverity.Critical]
												? "critical"
												: ""),
						n
					);
				})();
			(f.instance = new f()),
				(f.CategorySessionStart = "user"),
				(f.CategorySessionEnd = "session_end"),
				(f.CategoryDesign = "design"),
				(f.CategoryBusiness = "business"),
				(f.CategoryProgression = "progression"),
				(f.CategoryResource = "resource"),
				(f.CategoryError = "error"),
				(f.MaxEventCount = 500),
				(n.GAEvents = f);
		})(e.events || (e.events = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		!((n) => {
			var t = e.logging.GALogger,
				i = e.state.GAState,
				r = e.events.GAEvents,
				s = (() => {
					function e() {
						(this.blocks = new n.PriorityQueue({ compare: (e, n) => e - n })),
							(this.id2TimedBlockMap = {}),
							e.startThread();
					}
					return (
						(e.createTimedBlock = (e) => {
							void 0 === e && (e = 0);
							var t = new Date();
							return t.setSeconds(t.getSeconds() + e), new n.TimedBlock(t);
						}),
						(e.performTaskOnGAThread = (t, i) => {
							void 0 === i && (i = 0);
							var r = new Date();
							r.setSeconds(r.getSeconds() + i);
							var s = new n.TimedBlock(r);
							(s.block = t),
								(e.instance.id2TimedBlockMap[s.id] = s),
								e.instance.addTimedBlock(s);
						}),
						(e.performTimedBlockOnGAThread = (n) => {
							(e.instance.id2TimedBlockMap[n.id] = n),
								e.instance.addTimedBlock(n);
						}),
						(e.scheduleTimer = (t, i) => {
							var r = new Date();
							r.setSeconds(r.getSeconds() + t);
							var s = new n.TimedBlock(r);
							return (
								(s.block = i),
								(e.instance.id2TimedBlockMap[s.id] = s),
								e.instance.addTimedBlock(s),
								s.id
							);
						}),
						(e.getTimedBlockById = (n) =>
							n in e.instance.id2TimedBlockMap
								? e.instance.id2TimedBlockMap[n]
								: null),
						(e.ensureEventQueueIsRunning = () => {
							(e.instance.keepRunning = !0),
								e.instance.isRunning ||
									((e.instance.isRunning = !0),
									e.scheduleTimer(
										e.ProcessEventsIntervalInSeconds,
										e.processEventQueue,
									));
						}),
						(e.endSessionAndStopQueue = () => {
							i.isInitialized() &&
								(t.i("Ending session."),
								e.stopEventQueue(),
								i.isEnabled() &&
									i.sessionIsStarted() &&
									(r.addSessionEndEvent(), (i.instance.sessionStart = 0)));
						}),
						(e.stopEventQueue = () => {
							e.instance.keepRunning = !1;
						}),
						(e.ignoreTimer = (n) => {
							n in e.instance.id2TimedBlockMap &&
								(e.instance.id2TimedBlockMap[n].ignore = !0);
						}),
						(e.setEventProcessInterval = (n) => {
							n > 0 && (e.ProcessEventsIntervalInSeconds = n);
						}),
						(e.prototype.addTimedBlock = function (e) {
							this.blocks.enqueue(e.deadline.getTime(), e);
						}),
						(e.run = () => {
							clearTimeout(e.runTimeoutId);
							try {
								for (var n; (n = e.getNextBlock()); )
									if (!n.ignore)
										if (n.async) {
											if (!n.running) {
												(n.running = !0), n.block();
												break;
											}
										} else n.block();
								return void (e.runTimeoutId = setTimeout(
									e.run,
									e.ThreadWaitTimeInMs,
								));
							} catch (e) {
								t.e("Error on GA thread"), t.e(e.stack);
							}
						}),
						(e.startThread = () => {
							e.runTimeoutId = setTimeout(e.run, 0);
						}),
						(e.getNextBlock = () => {
							var n = new Date();
							return e.instance.blocks.hasItems() &&
								e.instance.blocks.peek().deadline.getTime() <= n.getTime()
								? e.instance.blocks.peek().async &&
									e.instance.blocks.peek().running
									? e.instance.blocks.peek()
									: e.instance.blocks.dequeue()
								: null;
						}),
						(e.processEventQueue = () => {
							r.processEvents("", !0),
								e.instance.keepRunning
									? e.scheduleTimer(
											e.ProcessEventsIntervalInSeconds,
											e.processEventQueue,
										)
									: (e.instance.isRunning = !1);
						}),
						e
					);
				})();
			(s.instance = new s()),
				(s.ThreadWaitTimeInMs = 1e3),
				(s.ProcessEventsIntervalInSeconds = 8),
				(n.GAThreading = s);
		})(e.threading || (e.threading = {}));
	})(gameanalytics || (gameanalytics = {}));
	var gameanalytics;
	!((e) => {
		var n = e.threading.GAThreading,
			t = e.logging.GALogger,
			i = e.store.GAStore,
			r = e.state.GAState,
			s = e.http.GAHTTPApi,
			o = e.device.GADevice,
			a = e.validators.GAValidator,
			u = e.http.EGAHTTPApiResponse,
			c = e.utilities.GAUtilities,
			d = e.events.GAEvents,
			l = (() => {
				function l() {}
				return (
					(l.init = () => {
						if (
							(o.touch(),
							(l.methodMap.configureAvailableCustomDimensions01 =
								l.configureAvailableCustomDimensions01),
							(l.methodMap.configureAvailableCustomDimensions02 =
								l.configureAvailableCustomDimensions02),
							(l.methodMap.configureAvailableCustomDimensions03 =
								l.configureAvailableCustomDimensions03),
							(l.methodMap.configureAvailableResourceCurrencies =
								l.configureAvailableResourceCurrencies),
							(l.methodMap.configureAvailableResourceItemTypes =
								l.configureAvailableResourceItemTypes),
							(l.methodMap.configureBuild = l.configureBuild),
							(l.methodMap.configureSdkGameEngineVersion =
								l.configureSdkGameEngineVersion),
							(l.methodMap.configureGameEngineVersion =
								l.configureGameEngineVersion),
							(l.methodMap.configureUserId = l.configureUserId),
							(l.methodMap.initialize = l.initialize),
							(l.methodMap.addBusinessEvent = l.addBusinessEvent),
							(l.methodMap.addResourceEvent = l.addResourceEvent),
							(l.methodMap.addProgressionEvent = l.addProgressionEvent),
							(l.methodMap.addDesignEvent = l.addDesignEvent),
							(l.methodMap.addErrorEvent = l.addErrorEvent),
							(l.methodMap.addErrorEvent = l.addErrorEvent),
							(l.methodMap.setEnabledInfoLog = l.setEnabledInfoLog),
							(l.methodMap.setEnabledVerboseLog = l.setEnabledVerboseLog),
							(l.methodMap.setEnabledManualSessionHandling =
								l.setEnabledManualSessionHandling),
							(l.methodMap.setCustomDimension01 = l.setCustomDimension01),
							(l.methodMap.setCustomDimension02 = l.setCustomDimension02),
							(l.methodMap.setCustomDimension03 = l.setCustomDimension03),
							(l.methodMap.setFacebookId = l.setFacebookId),
							(l.methodMap.setGender = l.setGender),
							(l.methodMap.setBirthYear = l.setBirthYear),
							(l.methodMap.setEventProcessInterval = l.setEventProcessInterval),
							(l.methodMap.startSession = l.startSession),
							(l.methodMap.endSession = l.endSession),
							(l.methodMap.onStop = l.onStop),
							(l.methodMap.onResume = l.onResume),
							"undefined" != typeof window &&
								void 0 !== window.GameAnalytics &&
								void 0 !== window.GameAnalytics.q)
						) {
							var e = window.GameAnalytics.q;
							for (var n in e) l.gaCommand.apply(null, e[n]);
						}
					}),
					(l.gaCommand = () => {
						for (var n = [], t = 0; t < arguments.length; t++)
							n[t] = arguments[t];
						n.length > 0 &&
							n[0] in e.GameAnalytics.methodMap &&
							(n.length > 1
								? e.GameAnalytics.methodMap[n[0]].apply(
										null,
										Array.prototype.slice.call(n, 1),
									)
								: e.GameAnalytics.methodMap[n[0]]());
					}),
					(l.configureAvailableCustomDimensions01 = (e) => {
						void 0 === e && (e = []),
							n.performTaskOnGAThread(() => {
								if (l.isSdkReady(!0, !1))
									return void t.w(
										"Available custom dimensions must be set before SDK is initialized",
									);
								r.setAvailableCustomDimensions01(e);
							});
					}),
					(l.configureAvailableCustomDimensions02 = (e) => {
						void 0 === e && (e = []),
							n.performTaskOnGAThread(() => {
								if (l.isSdkReady(!0, !1))
									return void t.w(
										"Available custom dimensions must be set before SDK is initialized",
									);
								r.setAvailableCustomDimensions02(e);
							});
					}),
					(l.configureAvailableCustomDimensions03 = (e) => {
						void 0 === e && (e = []),
							n.performTaskOnGAThread(() => {
								if (l.isSdkReady(!0, !1))
									return void t.w(
										"Available custom dimensions must be set before SDK is initialized",
									);
								r.setAvailableCustomDimensions03(e);
							});
					}),
					(l.configureAvailableResourceCurrencies = (e) => {
						void 0 === e && (e = []),
							n.performTaskOnGAThread(() => {
								if (l.isSdkReady(!0, !1))
									return void t.w(
										"Available resource currencies must be set before SDK is initialized",
									);
								r.setAvailableResourceCurrencies(e);
							});
					}),
					(l.configureAvailableResourceItemTypes = (e) => {
						void 0 === e && (e = []),
							n.performTaskOnGAThread(() => {
								if (l.isSdkReady(!0, !1))
									return void t.w(
										"Available resource item types must be set before SDK is initialized",
									);
								r.setAvailableResourceItemTypes(e);
							});
					}),
					(l.configureBuild = (e) => {
						void 0 === e && (e = ""),
							n.performTaskOnGAThread(() =>
								l.isSdkReady(!0, !1)
									? void t.w(
											"Build version must be set before SDK is initialized.",
										)
									: a.validateBuild(e)
										? void r.setBuild(e)
										: void t.i(
												"Validation fail - configure build: Cannot be null, empty or above 32 length. String: " +
													e,
											),
							);
					}),
					(l.configureSdkGameEngineVersion = (e) => {
						void 0 === e && (e = ""),
							n.performTaskOnGAThread(() => {
								if (!l.isSdkReady(!0, !1))
									return a.validateSdkWrapperVersion(e)
										? void (o.sdkGameEngineVersion = e)
										: void t.i(
												"Validation fail - configure sdk version: Sdk version not supported. String: " +
													e,
											);
							});
					}),
					(l.configureGameEngineVersion = (e) => {
						void 0 === e && (e = ""),
							n.performTaskOnGAThread(() => {
								if (!l.isSdkReady(!0, !1))
									return a.validateEngineVersion(e)
										? void (o.gameEngineVersion = e)
										: void t.i(
												"Validation fail - configure game engine version: Game engine version not supported. String: " +
													e,
											);
							});
					}),
					(l.configureUserId = (e) => {
						void 0 === e && (e = ""),
							n.performTaskOnGAThread(() =>
								l.isSdkReady(!0, !1)
									? void t.w(
											"A custom user id must be set before SDK is initialized.",
										)
									: a.validateUserId(e)
										? void r.setUserId(e)
										: void t.i(
												"Validation fail - configure user_id: Cannot be null, empty or above 64 length. Will use default user_id method. Used string: " +
													e,
											),
							);
					}),
					(l.initialize = (e, i) => {
						void 0 === e && (e = ""),
							void 0 === i && (i = ""),
							o.updateConnectionType();
						var s = n.createTimedBlock();
						(s.async = !0),
							(l.initTimedBlockId = s.id),
							(s.block = () =>
								l.isSdkReady(!0, !1)
									? void t.w(
											"SDK already initialized. Can only be called once.",
										)
									: a.validateKeys(e, i)
										? (r.setKeys(e, i), void l.internalInitialize())
										: void t.w(
												"SDK failed initialize. Game key or secret key is invalid. Can only contain characters A-z 0-9, gameKey is 32 length, gameSecret is 40 length. Failed keys - gameKey: " +
													e +
													", secretKey: " +
													i,
											)),
							n.performTimedBlockOnGAThread(s);
					}),
					(l.addBusinessEvent = (e, t, i, r, s) => {
						void 0 === e && (e = ""),
							void 0 === t && (t = 0),
							void 0 === i && (i = ""),
							void 0 === r && (r = ""),
							void 0 === s && (s = ""),
							o.updateConnectionType(),
							n.performTaskOnGAThread(() => {
								l.isSdkReady(!0, !0, "Could not add business event") &&
									d.addBusinessEvent(e, t, i, r, s);
							});
					}),
					(l.addResourceEvent = (t, i, r, s, a) => {
						void 0 === t && (t = e.EGAResourceFlowType.Undefined),
							void 0 === i && (i = ""),
							void 0 === r && (r = 0),
							void 0 === s && (s = ""),
							void 0 === a && (a = ""),
							o.updateConnectionType(),
							n.performTaskOnGAThread(() => {
								l.isSdkReady(!0, !0, "Could not add resource event") &&
									d.addResourceEvent(t, i, r, s, a);
							});
					}),
					(l.addProgressionEvent = (t, i, r, s, a) => {
						void 0 === t && (t = e.EGAProgressionStatus.Undefined),
							void 0 === i && (i = ""),
							void 0 === r && (r = ""),
							void 0 === s && (s = ""),
							o.updateConnectionType(),
							n.performTaskOnGAThread(() => {
								if (l.isSdkReady(!0, !0, "Could not add progression event")) {
									var e = void 0 !== a;
									d.addProgressionEvent(t, i, r, s, e ? a : 0, e);
								}
							});
					}),
					(l.addDesignEvent = (e, t) => {
						o.updateConnectionType(),
							n.performTaskOnGAThread(() => {
								if (l.isSdkReady(!0, !0, "Could not add design event")) {
									var n = void 0 !== t;
									d.addDesignEvent(e, n ? t : 0, n);
								}
							});
					}),
					(l.addErrorEvent = (t, i) => {
						void 0 === t && (t = e.EGAErrorSeverity.Undefined),
							void 0 === i && (i = ""),
							o.updateConnectionType(),
							n.performTaskOnGAThread(() => {
								l.isSdkReady(!0, !0, "Could not add error event") &&
									d.addErrorEvent(t, i);
							});
					}),
					(l.setEnabledInfoLog = (e) => {
						void 0 === e && (e = !1),
							n.performTaskOnGAThread(() => {
								e
									? (t.setInfoLog(e), t.i("Info logging enabled"))
									: (t.i("Info logging disabled"), t.setInfoLog(e));
							});
					}),
					(l.setEnabledVerboseLog = (e) => {
						void 0 === e && (e = !1),
							n.performTaskOnGAThread(() => {
								e
									? (t.setVerboseLog(e), t.i("Verbose logging enabled"))
									: (t.i("Verbose logging disabled"), t.setVerboseLog(e));
							});
					}),
					(l.setEnabledManualSessionHandling = (e) => {
						void 0 === e && (e = !1),
							n.performTaskOnGAThread(() => {
								r.setManualSessionHandling(e);
							});
					}),
					(l.setCustomDimension01 = (e) => {
						void 0 === e && (e = ""),
							n.performTaskOnGAThread(() => {
								if (
									!a.validateDimension01(e, r.getAvailableCustomDimensions01())
								)
									return void t.w(
										"Could not set custom01 dimension value to '" +
											e +
											"'. Value not found in available custom01 dimension values",
									);
								r.setCustomDimension01(e);
							});
					}),
					(l.setCustomDimension02 = (e) => {
						void 0 === e && (e = ""),
							n.performTaskOnGAThread(() => {
								if (
									!a.validateDimension02(e, r.getAvailableCustomDimensions02())
								)
									return void t.w(
										"Could not set custom02 dimension value to '" +
											e +
											"'. Value not found in available custom02 dimension values",
									);
								r.setCustomDimension02(e);
							});
					}),
					(l.setCustomDimension03 = (e) => {
						void 0 === e && (e = ""),
							n.performTaskOnGAThread(() => {
								if (
									!a.validateDimension03(e, r.getAvailableCustomDimensions03())
								)
									return void t.w(
										"Could not set custom03 dimension value to '" +
											e +
											"'. Value not found in available custom03 dimension values",
									);
								r.setCustomDimension03(e);
							});
					}),
					(l.setFacebookId = (e) => {
						void 0 === e && (e = ""),
							n.performTaskOnGAThread(() => {
								a.validateFacebookId(e) && r.setFacebookId(e);
							});
					}),
					(l.setGender = (t) => {
						void 0 === t && (t = e.EGAGender.Undefined),
							n.performTaskOnGAThread(() => {
								a.validateGender(t) && r.setGender(t);
							});
					}),
					(l.setBirthYear = (e) => {
						void 0 === e && (e = 0),
							n.performTaskOnGAThread(() => {
								a.validateBirthyear(e) && r.setBirthYear(e);
							});
					}),
					(l.setEventProcessInterval = (e) => {
						n.performTaskOnGAThread(() => {
							n.setEventProcessInterval(e);
						});
					}),
					(l.startSession = () => {
						if (r.getUseManualSessionHandling()) {
							if (!r.isInitialized()) return;
							var e = n.createTimedBlock();
							(e.async = !0),
								(l.initTimedBlockId = e.id),
								(e.block = () => {
									r.isEnabled() &&
										r.sessionIsStarted() &&
										n.endSessionAndStopQueue(),
										l.resumeSessionAndStartQueue();
								}),
								n.performTimedBlockOnGAThread(e);
						}
					}),
					(l.endSession = () => {
						r.getUseManualSessionHandling() && l.onStop();
					}),
					(l.onStop = () => {
						n.performTaskOnGAThread(() => {
							try {
								n.endSessionAndStopQueue();
							} catch (e) {}
						});
					}),
					(l.onResume = () => {
						var e = n.createTimedBlock();
						(e.async = !0),
							(l.initTimedBlockId = e.id),
							(e.block = () => {
								l.resumeSessionAndStartQueue();
							}),
							n.performTimedBlockOnGAThread(e);
					}),
					(l.internalInitialize = () => {
						r.ensurePersistedStates(),
							i.setItem(r.DefaultUserIdKey, r.getDefaultId()),
							r.setInitialized(!0),
							l.newSession(),
							r.isEnabled() && n.ensureEventQueueIsRunning();
					}),
					(l.newSession = () => {
						t.i("Starting a new session."),
							r.validateAndFixCurrentDimensions(),
							s.instance.requestInit(l.startNewSessionCallback);
					}),
					(l.startNewSessionCallback = (e, s) => {
						if (e === u.Ok && s) {
							var o = 0;
							if (s.server_ts) {
								var a = s.server_ts;
								o = r.calculateServerTimeOffset(a);
							}
							(s.time_offset = o),
								i.setItem(r.SdkConfigCachedKey, c.encode64(JSON.stringify(s))),
								(r.instance.sdkConfigCached = s),
								(r.instance.sdkConfig = s),
								(r.instance.initAuthorized = !0);
						} else
							e == u.Unauthorized
								? (t.w("Initialize SDK failed - Unauthorized"),
									(r.instance.initAuthorized = !1))
								: (e === u.NoResponse || e === u.RequestTimeout
										? t.i(
												"Init call (session start) failed - no response. Could be offline or timeout.",
											)
										: e === u.BadResponse ||
												e === u.JsonEncodeFailed ||
												e === u.JsonDecodeFailed
											? t.i(
													"Init call (session start) failed - bad response. Could be bad response from proxy or GA servers.",
												)
											: (e !== u.BadRequest && e !== u.UnknownResponseCode) ||
												t.i(
													"Init call (session start) failed - bad request or unknown response.",
												),
									null == r.instance.sdkConfig
										? null != r.instance.sdkConfigCached
											? (t.i(
													"Init call (session start) failed - using cached init values.",
												),
												(r.instance.sdkConfig = r.instance.sdkConfigCached))
											: (t.i(
													"Init call (session start) failed - using default init values.",
												),
												(r.instance.sdkConfig = r.instance.sdkConfigDefault))
										: t.i(
												"Init call (session start) failed - using cached init values.",
											),
									(r.instance.initAuthorized = !0));
						if (
							((r.instance.clientServerTimeOffset = r.instance.sdkConfig
								.time_offset
								? r.instance.sdkConfig.time_offset
								: 0),
							!r.isEnabled())
						)
							return (
								t.w("Could not start session: SDK is disabled."),
								void n.stopEventQueue()
							);
						n.ensureEventQueueIsRunning();
						var f = c.createGuid();
						(r.instance.sessionId = f),
							(r.instance.sessionStart = r.getClientTsAdjusted()),
							d.addSessionStartEvent();
						var v = n.getTimedBlockById(l.initTimedBlockId);
						null != v && (v.running = !1), (l.initTimedBlockId = -1);
					}),
					(l.resumeSessionAndStartQueue = () => {
						r.isInitialized() &&
							(t.i("Resuming session."),
							r.sessionIsStarted() || l.newSession());
					}),
					(l.isSdkReady = (e, n, i) => (
						void 0 === n && (n = !0),
						void 0 === i && (i = ""),
						i && (i += ": "),
						e && !r.isInitialized()
							? (n && t.w(i + "SDK is not initialized"), !1)
							: !(e && !r.isEnabled()) || (n && t.w(i + "SDK is disabled"), !1)
					)),
					l
				);
			})();
		(l.initTimedBlockId = -1), (l.methodMap = {}), (e.GameAnalytics = l);
	})(gameanalytics || (gameanalytics = {})),
		gameanalytics.GameAnalytics.init();
	var GameAnalytics = gameanalytics.GameAnalytics.gaCommand;
	scope.gameanalytics = gameanalytics;
	scope.GameAnalytics = GameAnalytics;
})(this);
