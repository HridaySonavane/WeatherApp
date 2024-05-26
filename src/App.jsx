import React, { useEffect, useState } from "react";
import WindArrow from "./components/WindArrow";

function App() {
	const [data, setData] = useState({});
	const [location, setLocation] = useState("");
	const [userLocation, setUserLocation] = useState(null);

	const getUserLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					// what to do once we have the position
					const { latitude, longitude } = position.coords;
					setUserLocation({ latitude, longitude });
				},
				(error) => {
					// display an error if we cant get the users position
					console.error("Error getting user location:", error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	};

	useEffect(() => {
		getUserLocation();
	}, []);

	useEffect(() => {
		if (userLocation) {
			fetchWeatherData(userLocation.latitude, userLocation.longitude);
		}
	}, [userLocation]);

	const fetchWeatherData = (latitude, longitude) => {
		fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=6a530379c012020b5a34479e59622d92`
		)
			.then((response) => response.json())
			.then((data) => {
				setData(data);
				console.log(data);
			});
	};

	const searchLocation = (event) => {
		if (event.key === "Enter") {
			fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&q=${location}&units=metric&appid=6a530379c012020b5a34479e59622d92`
				// `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&units=metric&appid=6a530379c012020b5a34479e59622d92`
			)
				.then((response) => response.json())
				.then((data) => {
					setData(data);
					console.log(data);
				});
			setLocation("");
		}
	};

	return (
		<div className="app w-screen h-screen relative bg-[rgba(0,0,0,0.4)] text-white overflow-hidden ">
			<img
				src="https://img.freepik.com/free-photo/digital-art-isolated-house_23-2151041282.jpg?t=st=1716466644~exp=1716470244~hmac=ff74d8a5aadd300e015c99c13c50ae1a09c52b09af77945205fb1964c671b864&w=1380"
				className="absolute w-full h-full top-0 left-0 z-[-1] object-cover object-center bg-no-repeat "
				alt=""
			/>
			<div className="search h-20 flex justify-center items-center">
				<input
					className="text-white h-12 w-80 p-4 rounded-full bg-black/40 focus:shadow focus:shadow-[#924564] focus:outline-none transition-shadow"
					type="text"
					value={location}
					onChange={(event) => setLocation(event.target.value)}
					onKeyDown={searchLocation}
					placeholder="Enter City Name"
				/>
			</div>
			<div className="myContainer w-screen h-screen mx-auto py-4 pb-28 relative flex flex-col justify-between items-center">
				{data.name != undefined && (
					<div className="top w-2/5 h-44 mx-4 my-4 flex flex-row justify-center items-center bg-white/20 backdrop-blur-[6px] p-2 rounded-lg shadow-md shadow-white/20">
						<div className="location basis-1/4 text-center">
							<p className="text-4xl">{data.name}</p>
						</div>

						<div className="tempRange basis-2/4">
							<div className="temp text-center">
								{data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
							</div>
							<div className="minMax">
								{data.main ? (
									<p className="font-mono text-center">
										{data.main.temp_min.toFixed()}°C/
										{data.main.temp_max.toFixed()}°C
									</p>
								) : null}
							</div>
						</div>

						<div className="description basis-1/4 text-center ">
							{data.weather ? (
								<div className="skyData grid grid-cols-1 justify-items-center">
									<p className="text-4xl">{data.weather[0].main}</p>
									<img
										className=""
										src={` https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
										alt=""
									/>
								</div>
							) : null}
						</div>
					</div>
				)}
				{data.name != undefined && (
					<div className="bottom w-1/3 flex flex-row justify-around items-center bg-white/20 rounded-lg shadow-md shadow-white/20 text-center backdrop-blur-[6px]">
						<div className="feels">
							{data.main ? <p>{data.main.feels_like.toFixed()}°C</p> : null}
							<h2>Feel's Like</h2>
						</div>
						<div className="humidity">
							{data.main ? <p>{data.main.humidity}%</p> : null}
							<h2>Humidity</h2>
						</div>
						<div className="wind">
							{data.wind ? (
								<div className="windDetail">
									<p>{(data.wind.speed * 3.6).toFixed()} km/h</p>
								</div>
							) : null}
							<h2>Wind Speed</h2>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
