'use strict';


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);
    clicks = 0;
    constructor(coords, distance, duration) {
        this.coords = coords; // [lat,lgn]
        this.distance = distance; // in km
        this.duration = duration; // in min

    }
    _setDesc() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
    click() {
        this.clicks++;
    }
}


class Running extends Workout {
    type = 'running';
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDesc();
    }
    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout {
    type = 'cycling';

    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDesc();

    }
    calcSpeed() {
        // km / h
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

// const run1 = new Running([93, -12], 5.2, 24, 178);
// const cycling1 = new Running([93, -12], 27, 24, 500);

// console.log(run1);
// console.log(cycling1);

//  APPLICATION
class App {
    #map;
    #mapZoomLevel = 13;
    #mapEvent;
    #workouts = [];
    constructor() {

        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);

        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    }
    _getPosition() {
        // using the geolocation API
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),

                function () {
                    alert('Could not get your position');
                });

    }
    _loadMap(position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        console.log(`https://www.google.fr/maps/@${latitude},${longitude}`);

        const coords = [latitude, longitude];
        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this));
    }
    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }
    _hideForm() {
        // empty inputs
        inputElevation.value = inputDuration.value = inputDistance.value = inputCadence.value = '';
        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => form.style.display = 'grid', 1000);
    }
    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');

    }
    _newWorkout(e) {
        const validInputs = (...inputs) => { return inputs.every(inp => Number.isFinite(inp)) };

        const allPositive = (...inputs) => { return inputs.every(inp => inp > 0); }
        e.preventDefault();
        // get data from the form
        const type = inputType.value;
        const distance = Number(inputDistance.value);
        const duration = Number(inputDuration.value);
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;

        // check validity

        // if running, create running obj
        if (type === 'running') {
            const cadence = +inputCadence.value;

            if (!validInputs(distance, duration, cadence)
                || !allPositive(distance, duration, cadence)) {
                return alert('Inputs have to be a positive number');
            }
            workout = new Running([lat, lng], distance, duration, cadence);
        }

        // if cycling, create cycling obj 
        if (type === 'cycling') {
            const elevation = +inputElevation.value;
            if (!validInputs(distance, duration, elevation)
                || !allPositive(distance, duration)) {
                return alert('Inputs have to be a positive number');
            }
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }

        // add new object to workout array
        this.#workouts.push(workout);

        // render workout on map as marker
        this._renderWorkoutMarker(workout);

        // render workout on list
        this._renderWorkout(workout);

        // hide form + clear input fields
        this._hideForm();

    }


    _renderWorkoutMarker(workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`,
            }))
            .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
            .openPopup();
    }

    _renderWorkout(workout) {
        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div >
            <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">min</span>
            </div>`;

        if (workout.type === 'running') {
            html += `
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>`;
        }
        if (workout.type === 'cycling') {
            html += `
             <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
            `;
        }
        form.insertAdjacentHTML('afterend', html);



    }
    _moveToPopup(e) {
        const workoutEl = e.target.closest('.workout');
        // console.log(workoutEl);

        if (!workoutEl) return;

        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);

        console.log(workout);

        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            animate: true,
            pan: {
                duration: 1
            }
        });

        workout.click();
    }
}
const app = new App();

