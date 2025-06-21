/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type LengthUnits = "meter" | "kilometer" | "mile" | "foot";
type WeightUnits = "gram" | "kilogram" | "pound" | "ounce";
type TempUnits = "celsius" | "fahrenheit" | "kelvin";
type TimeUnits = "second" | "minute" | "hour" | "day";

type Category = "length" | "weight" | "temperature" | "time";

const conversionRates = {
  length: {
    meter: 1,
    kilometer: 0.001,
    mile: 0.000621371,
    foot: 3.28084,
  } as Record<LengthUnits, number>,

  weight: {
    gram: 1,
    kilogram: 0.001,
    pound: 0.00220462,
    ounce: 0.035274,
  } as Record<WeightUnits, number>,

  time: {
    second: 1,
    minute: 1 / 60,
    hour: 1 / 3600,
    day: 1 / 86400,
  } as Record<TimeUnits, number>,
};

export default function Page() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState<
    LengthUnits | WeightUnits | TempUnits | TimeUnits
  >("meter");
  const [toUnit, setToUnit] = useState<
    LengthUnits | WeightUnits | TempUnits | TimeUnits
  >("kilometer");
  const [inputValue, setInputValue] = useState("0");
  const [result, setResult] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const newHref = href.split('?')[0] + `?v=${Date.now()}`;
        link.setAttribute('href', newHref);
      }
    });
  }, []);

  useEffect(() => {
    switch (category) {
      case "length":
        setFromUnit("meter");
        setToUnit("kilometer");
        break;
      case "weight":
        setFromUnit("gram");
        setToUnit("pound");
        break;
      case "temperature":
        setFromUnit("celsius");
        setToUnit("fahrenheit");
        break;
      case "time":
        setFromUnit("second");
        setToUnit("minute");
        break;
    }
  }, [category]);

  function convertTemperature(
    val: number,
    from: TempUnits,
    to: TempUnits
  ): number {
    if (from === to) return val;

    let celsiusVal: number;
    switch (from) {
      case "celsius":
        celsiusVal = val;
        break;
      case "fahrenheit":
        celsiusVal = (val - 32) * (5 / 9);
        break;
      case "kelvin":
        celsiusVal = val - 273.15;
        break;
      default:
        celsiusVal = val;
    }

    switch (to) {
      case "celsius":
        return celsiusVal;
      case "fahrenheit":
        return celsiusVal * (9 / 5) + 32;
      case "kelvin":
        return celsiusVal + 273.15;
      default:
        return celsiusVal;
    }
  }

  function calculateConversion(val: string) {
    const numericVal = parseFloat(val);
    if (isNaN(numericVal)) return null;

    if (category === "length") {
      const rateFrom = conversionRates.length[fromUnit as LengthUnits];
      const rateTo = conversionRates.length[toUnit as LengthUnits];
      return (numericVal / rateFrom) * rateTo;
    } else if (category === "weight") {
      const rateFrom = conversionRates.weight[fromUnit as WeightUnits];
      const rateTo = conversionRates.weight[toUnit as WeightUnits];
      return (numericVal / rateFrom) * rateTo;
    } else if (category === "temperature") {
      return convertTemperature(
        numericVal,
        fromUnit as TempUnits,
        toUnit as TempUnits
      );
    } else if (category === "time") {
      const rateFrom = conversionRates.time[fromUnit as TimeUnits];
      const rateTo = conversionRates.time[toUnit as TimeUnits];
      return (numericVal / rateFrom) * rateTo;
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const conversionResult = calculateConversion(inputValue);
    setResult(conversionResult);

    const formData = new FormData();
    formData.append("password", inputValue);

    const res = await fetch("/api/submit-password", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/home");
    }
  }

  const availableUnits =
    category === "length"
      ? (["meter", "kilometer", "mile", "foot"] as (
          | LengthUnits
          | WeightUnits
          | TempUnits
          | TimeUnits
        )[])
      : category === "weight"
      ? (["gram", "kilogram", "pound", "ounce"] as (
          | LengthUnits
          | WeightUnits
          | TempUnits
          | TimeUnits
        )[])
      : category === "temperature"
      ? (["celsius", "fahrenheit", "kelvin"] as (
          | LengthUnits
          | WeightUnits
          | TempUnits
          | TimeUnits
        )[])
      : (["second", "minute", "hour", "day"] as (
          | LengthUnits
          | WeightUnits
          | TempUnits
          | TimeUnits
        )[]);

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <main className="p-6 mx-auto mt-10 border-2 border-black">
        <h1 className="mb-6 text-2xl font-semibold text-center">
          Unit Converter
        </h1>
        <h2>Want more conversions? Look <a className="text-blue-500 underline" href="https://www.unitconverters.net/">here</a>.</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center">
            <label htmlFor="category" className="block mb-2 font-medium">
              Category:
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full m-2 border focus:outline-none focus:ring-2 "
            >
              <option value="length">Length</option>
              <option value="weight">Weight</option>
              <option value="temperature">Temperature</option>
              <option value="time">Time</option>
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="fromUnit" className="block mb-2 font-medium">
              From:
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as any)}
              className="w-full m-2 border focus:outline-none focus:ring-2 "
            >
              {availableUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="toUnit" className="block mb-2 font-medium">
              To:
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value as any)}
              className="w-full m-2 border focus:outline-none focus:ring-2 "
            >
              {availableUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="inputValue" className="block mb-2 font-medium">
              Value:
            </label>
            <input
              id="inputValue"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full pl-1 m-2 border focus:outline-none focus:ring-2"
              placeholder="Enter value to convert"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 m-2 font-semibold transition-colors border"
          >
            Convert
          </button>
        </form>

        {result !== null && !isNaN(result) && (
          <p className="mt-6 text-lg font-semibold text-center">
            Result: {result.toFixed(4)}
          </p>
        )}
        {message && (
          <p className="mt-4 font-semibold text-center text-red-500">
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
