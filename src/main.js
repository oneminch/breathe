import Keyframes from "@keyframes/core"; // Import keyframes module

const techniques_list = document.querySelector(".techniques"); // Techniques list container
const techniques = document.querySelectorAll(".techniques__technique"); // List of techniques

const breathe_container = document.querySelector(".breathe"); // Container for technique details and practice actions
const technique_details = document.querySelector(".technique"); // Each technique details

const exit_btn = document.querySelector(".close"); // Close technique pop up button
const back_btn = document.querySelector(".back"); // Navigate technique pop up (Go back)

const practice_visual = document.querySelector(".practice__visual span"); // Practice technique circle visual
const practice_task = document.querySelector(".practice__task"); // Practice technique task visual

// List of techniques data
const list = [
	{
		id: 1,
		name: "Box Breathing",
		desc: `This technique (a.k.a Square Breathing) is a calming breathing technique used by people like athletes in stressful situations. Breathe in for 4 seconds, followed by holding in breath for 4 seconds, then exhale for 4 seconds, followed by holding out breath for 4 seconds.`,
		secs: [4, 4, 4, 4]
	},
	{
		id: 2,
		name: "4-7-8 Breathing",
		desc: `This technique is a form of deep breathing that helps relieve stress and fall asleep faster. Breathe in for 4 seconds, hold breath for 7 seconds and, then exhale for 8 seconds.`,
		secs: [4, 7, 8, 0]
	},
	{
		id: 3,
		name: "Deep Breathing",
		desc: `Used to reduce anxiety, this technique involves inhaling and holding for a few seconds and exhaling for a longer period. Breathe in for 4 seconds, hold in breath for 4 seconds and, then exhale for 6 seconds.`,
		secs: [4, 4, 6, 0]
	},
	{
		id: 4,
		name: "Equal Breathing",
		desc: `This mindful technique involves inhaling for the same amount of time as exhaling. Breathe in for 4 seconds and breathe out for 4 seconds.`,
		secs: [4, 0, 4, 0]
	},
	{
		id: 5,
		name: "Breath Counting",
		desc: `This technique is exactly what it sounds like and it helps become more mindful. Breathe as you would normally do and count each inhale and each exhale.`,
		secs: [2, 0, 2, 0]
	},
	{
		id: 6,
		name: "Rhythmic Breathing",
		desc: `As its name suggests, this technique follows a rhythm. Breathe in for 6 seconds, hold in breath for 3 seconds, Breathe out for 6 seconds and hold out breath for 3 seconds.`,
		secs: [6, 3, 6, 3]
	}
];

let t_o = []; // Timeout variable for reference
let stop_practice = false; // End practice boolean
let current_technique; // Currently selected technique
let animate; // Keyframes (Animation) instance

const expanded = { transform: "scale(.95)" };
const collapsed = { transform: "scale(.65)" };

// Render list of techniques to the UI
const render_techniques_list = (array_list) => {
	let technique;

	techniques_list.innerHTML = "";
	array_list.forEach((item) => {
		technique = document.createElement("div");
		technique.innerHTML = `
			<p>${item.name}</p>
			<span>Click to view</span>
		`;
		technique.classList.add("techniques__technique");
		technique.setAttribute("data-id", `${item.id}`);
		technique.addEventListener("click", () => {
			display_details(item);
		});

		// Render markup to UI
		techniques_list.appendChild(technique);
	});
};
render_techniques_list(list);

// Clear all timeout
const reset_timeouts = () => {
	for (let i = 0; i < t_o.length; i++) {
		clearTimeout(t_o[i]);
	}
	t_o = [];
};

// Resets all functions and visuals
const reset_practice = (scale_value = 0.63) => {
	if (animate) animate.reset();
	reset_timeouts();
	practice_visual.style.transform = `scale(${scale_value})`;
};

// Inialize keyframes module instance
const init_keyframes = () => {
	Keyframes.define([
		{
			name: "breathe-in",
			from: collapsed,
			to: expanded
		},
		{
			name: "breathe-out",
			from: expanded,
			to: collapsed
		},
		{
			name: "hold-in",
			from: expanded,
			to: expanded
		},
		{
			name: "hold-out",
			from: collapsed,
			to: collapsed
		}
	]);

	animate = new Keyframes(practice_visual);
};

// Update task for each round: breathe in, out or hold in, out
const update_task = (message) => {
	practice_task.innerHTML = message;
};

// Countdown timer function for get_ready()
let interval;
const countdown_timer = (seconds) => {
	clearInterval(interval);
	const now = Date.now();
	const later = now + seconds * 1000;
	update_task(`Ready...😃`);

	interval = setInterval(() => {
		const timeLeft = Math.round((later - Date.now()) / 1000);

		if (timeLeft <= 0) {
			clearInterval(interval);
			return;
		}
		update_task(`Ready...😃 <br> ${timeLeft}`);
	}, 1000);
};

// Wait til user is ready (3 seconds) and run breathe
const get_ready = (seconds, rounds) => {
	// update_task("Ready...😃");
	countdown_timer(4);
	run_after(4, () => breathe(seconds, rounds));
};

// Determine number of rounds for a two minute (120s/2min) session
const determine_rounds = (seconds_arr) => {
	let total_seconds = seconds_arr.reduce((sum, breath) => sum + breath);
	console.log(Math.ceil(120 / total_seconds));
	return Math.ceil(120 / total_seconds);
};

// Generate random images for description mode
const get_random_image = () => {
	let random_num = Math.ceil(Math.random() * 4);
	return `./img/random/${random_num}.svg`;
};

// Close pop-up and return to main page
exit_btn.addEventListener("click", () => {
	// Reset and stop practice mode
	reset_practice();
	stop_practice = true;

	if (breathe_container.classList.contains("description-mode")) {
		breathe_container.classList.remove("description-mode");
	} else if (breathe_container.classList.contains("practice-mode")) {
		breathe_container.classList.remove("practice-mode");
	}
});

// Navigate pop-up
back_btn.addEventListener("click", () => {
	// Reset and stop practice mode
	reset_practice();
	stop_practice = true;

	if (breathe_container.classList.contains("practice-mode")) {
		breathe_container.classList.add("description-mode");
		breathe_container.classList.remove("practice-mode");
	}
});

// Open details for selected technique
const display_details = (item) => {
	current_technique = item.secs; // Get the seconds for selected technique
	let markup = ``;
	markup = `
		<div class="technique__image">
			<img src="${get_random_image()}" alt="Random Image">
		</div>
		<h3 class="technique__name">${item.name}</h3>
		<div class="technique__description">
			${item.desc} 
			<br><br>
			<span>
				Get comfortable & Start breathing.
			</span>
		</div>
	`;

	// Add practice button and attach event listener on it
	const btn = document.createElement("div");
	btn.innerHTML = "Start";
	btn.classList.add("technique__continue");
	btn.addEventListener("click", start_practice);

	// Render markup and button html to UI
	technique_details.innerHTML = "";
	technique_details.insertAdjacentHTML("afterbegin", markup);
	technique_details.appendChild(btn);

	breathe_container.classList.add("description-mode");
};

// Switch to practice mode and start practice
const start_practice = () => {
	breathe_container.classList.remove("description-mode");
	breathe_container.classList.add("practice-mode");

	stop_practice = false;
	init_keyframes();
	get_ready(current_technique, determine_rounds(current_technique));
};

const run_after = (s, f) => {
	if (!stop_practice) {
		t_o.push(setTimeout(() => f(), s * 1000));
	} else {
		return;
	}
};

// Hold current breath: in or out
const hold = (type, time) => {
	if (!stop_practice) {
		// Exit if there's no hold time
		if (time === 0) return;

		if (type === "in") {
			animate.play(
				{
					name: "hold-in",
					duration: `${time}s`,
					timingFunction: "linear",
					delay: "0s",
					iterationCount: 1
				},
				{
					onBeforeStart: () => {
						update_task("Hold breath...");
					}
				}
			);
		} else if (type === "out") {
			animate.play(
				{
					name: "hold-out",
					duration: `${time}s`,
					timingFunction: "linear",
					delay: "0s",
					iterationCoun: 1
				},
				{
					onBeforeStart: () => {
						update_task("Hold breath...");
					}
				}
			);
		}
	} else {
		return;
	}
};

// Expand circle to simulate breathing in
const expand = (seconds) => {
	if (!stop_practice) {
		let breathe_in = seconds[0];
		let hold_in = seconds[1];

		animate.play(
			{
				name: "breathe-in",
				duration: `${breathe_in}s`,
				timingFunction: "linear",
				delay: "0s",
				iterationCount: 1
			},
			{
				onBeforeStart: () => {
					update_task("Breathe in...");
				},
				onEnd: () => {
					hold("in", hold_in);
				}
			}
		);
	} else {
		return;
	}
};

// Collapse circle to simulate breathing out
const collapse = (seconds) => {
	if (!stop_practice) {
		let breathe_out = seconds[2];
		let hold_out = seconds[3];

		animate.play(
			{
				name: "breathe-out",
				duration: `${breathe_out}s`,
				timingFunction: "linear",
				delay: "0s",
				iterationCount: 1
			},
			{
				onBeforeStart: () => {
					update_task("Breathe out...");
				},
				onEnd: () => {
					hold("out", hold_out);
				}
			}
		);
	} else {
		return;
	}
};

// Run multiple iterations or rounds of breathing
const breathe = (seconds, rounds) => {
	reset_timeouts();

	// Exit case after 'rounds' of practice
	if (!stop_practice) {
		if (rounds === 0) {
			update_task("Complete 😊");
			reset_practice(0.65);
			run_after(3, () => {
				breathe_container.classList.remove("practice-mode");
			});
			return;
		}

		let total_in = seconds[0] + seconds[1]; // Total in-breath time (breathe_in + hold_in)
		let total = seconds.reduce((s, b) => s + b); // Total breath time: all in and out

		// Run one round of breathing
		run_after(total_in, () => collapse(seconds));
		expand(seconds);

		// After one round of breathing, repeat
		rounds -= 1;
		run_after(total, () => breathe(seconds, rounds));
	} else {
		return;
	}
};
