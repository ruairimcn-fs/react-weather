// src/app/api/data/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Extract cityInput from the request body
        const { cityInput } = await req.json();

        // Make a request to the OpenWeather API
        const getWeatherData = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
        );
        
        const data = await getWeatherData.json();

        // Return the weather data as JSON
        console.log(NextResponse.json(data));
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
