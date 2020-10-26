import firebase from 'firebase/app';
import image from '../../helpers/images/seating.png';
import reservationData from '../../helpers/data/reservationData';
import reservationView from '../views/reservationView';
import tablesData from '../../helpers/data/tablesData';
import staffData from '../../helpers/data/staffData';

require('jquery-ui-bundle');

const reservationTimes = () => {
  const times = [
    '5:00pm',
    '5:30pm',
    '6:00pm',
    '6:30pm',
    '7:00pm',
    '7:30pm',
    '8:00pm',
    '8:30pm',
    '9:00pm',
    '9:30pm',
    '10:00pm',
  ];
  times.forEach((item) => {
    $('#time').append(`<option value="${item}">${item}</option>`);
  });
};

const guestNumber = () => {
  const numGuests = [1, 2, 3, 4];
  numGuests.forEach((guest) => {
    $('#numberOfGuests').append(`<option value="${guest}">${guest}</option>`);
  });
};

const tables = (guests) => {
  tablesData.getAllTables().then((response) => {
    response.sort((a, b) => a.number - b.number).forEach((item) => {
      if (guests <= item.numberOfSeats) {
        $('#table').append(`<option value="${item.number}">Table ${item.number} - ${item.numberOfSeats} Seats</option>`);
      }
    });
  });
};

// SECOND FORM TO APPEAR
const addGuestInfo = (data) => {
  $('#add-reservation').html(`<h2 class="form-title">Enter User Info</h2>
        <div id="success-message"></div>
          <div id="error-message"></div>
    <form>
    <div id="input-group">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input type="text" class="form-control" id="firstName" placeholder="First Name">
        </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input class="form-control" id="lastName" autocomplete="off" placeholder="Last Name">
          </div>
          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input type="tel" class="form-control" id="phoneNumber" class="timePicker" autocomplete="off" placeholder="ex: 615-123-4567">
          </div>
          </div>
          <button id="addReservationBtn" type="button" class="btn btn-outline"><i class="fas fa-plus-circle"></i> Complete Reservation</button>
        </form>`);
  $('#addReservationBtn').on('click', (e) => {
    e.preventDefault();
    //   This is adding the new data to the first data object
    const guestData = data;
    guestData.firstName = $('#firstName').val() || false;
    guestData.lastName = $('#lastName').val() || false;
    guestData.phoneNumber = $('#phoneNumber').val() || false;
    if (Object.values(guestData).includes(false)) {
      $('#error-message').html(
        '<div class="alert" role="alert">Please complete all fields</div>'
      );
    } else {
      $('#error-message').html('');
      reservationData
        .addReservation(data)
        .then(() => {
          $('#success-message').html(
            '<div class="alert" role="alert">Your Reservation Was Added!</div>'
          );
        })
        .then(() => {
          setTimeout(() => {
            firebase.auth().onAuthStateChanged((user) => {
              reservationView.reservationView(user);
            });
          }, 3000);
        })
        .catch((error) => console.warn(error));
      setTimeout(() => {
        $('#success-message').html('');
      }, 3000);
      $('#firstName').val('');
      $('#lastName').val('');
      $('#phoneNumber').val('');
    }
  });
};

const addStaffInfo = (data) => {
  $('#add-reservation').html(`<h2 class="form-title">Add Staff to Reservation</h2>
        <div id="success-message"></div>
          <div id="error-message"></div>
    <form>
    <div id="input-group">
      <div class="form-group">
          <label for="table">Table</label>
          <select class="form-control" id="table">
            <option value="">Select a Table</option>
          </select>
      </div>
      </div>
    <div id="input-group">
        <div class="form-group">
          <label for="server">Server</label>
          <select class="form-control" id="Server">
                <option value="">Select a Server</option>
              </select>
        </div>
          <div class="form-group">
            <label for="Busser">Busser</label>
            <select class="form-control" id="Busser">
                <option value="">Select a Busser</option>
              </select>
          </div>
          <div class="form-group">
            <label for="Bartender">Bartender</label>
            <select class="form-control" id="Bartender">
                <option value="">Select a Bartender</option>
              </select>
          </div>
          <div class="form-group">
            <label for="Host">Host</label>
            <select class="form-control" id="Host">
                <option value="">Select a Host</option>
              </select>
          </div>
          </div>
          <div id="seating-section">
          <button id="seatingBtn" type="button" class="btn btn-outline">View Seating Chart</button>
          <button id="add-guest-btn" type="button" class="btn btn-outline"><i class="fas fa-plus-circle"></i> Add Guest Info</button>
          <div id="viewSeats"></div>
          </div>
        </form>`);

  staffData.getAllStaff().then((response) => {
    response.forEach((item) => {
      const { role } = item;
      $(`#${role}`).append(`<option value="${item.name}">${item.name}</option>`);
    });
  });

  // TABLES DROPDOWN
  tables(data.numberOfGuests);

  //  Code for seating chart dropdown
  let seatingChartIsNotShown = true;
  $('#seatingBtn').on('click', (e) => {
    e.preventDefault();
    if (seatingChartIsNotShown) {
      $('#viewSeats').html(`<img id="seatingChart"src="${image}" alt="seating chart">`);
      seatingChartIsNotShown = false;
    } else {
      $('#viewSeats').html('');
      seatingChartIsNotShown = true;
    }
  });

  $('#add-guest-btn').on('click', (e) => {
    e.preventDefault();
    const staffReservationData = data;
    staffReservationData.table = $('#table').val() || '';
    staffReservationData.server = $('#Server').val() || '';
    staffReservationData.busser = $('#Busser').val() || '';
    staffReservationData.bartender = $('#Bartender').val() || '';
    staffReservationData.host = $('#Host').val() || '';
    addGuestInfo(data);
    setTimeout(() => {
      $('#success-message').html('');
    }, 3000);
  });
};

// First Form to Appear
const addReservationForm = () => {
  $('#add-reservation').html(`<h2 class="form-title">Add A Reservation</h2>
    <div id="success-message"></div>
    <div>
      <div id="error-message"></div>
<div id="input-group">
      <div class="form-group">
        <label for="image">Number of Guests</label>
        <select class="form-control" id="numberOfGuests">
            <option value="">Number of Guests</option>
          </select>
      </div>
      <div class="form-group">
        <label for="date">Date</label>
        <input class="form-control" id="datePicker" autocomplete="off" placeholder="Click to choose a date">
      </div>
      <div class="form-group">
      <label for="time">Time</label>
      <select class="form-control" id="time">
        <option value="">Select a Time</option>
      </select>
      </div>
    </div>
    <div id="reservation-buttons">
    <button id="staffReservationBtn" type="button" class="btn btn-outline"><i class="fas fa-plus-circle"></i> Add Staff Info</button>
    </div>
    </div>
    </div>`);

  // Code for Date dropdown
  $('#datePicker').datepicker();

  // RESERVATION TIMES DROPDOWN
  reservationTimes();

  // Number of Guests Dropdown
  guestNumber();

  $('#staffReservationBtn').on('click', (e) => {
    e.preventDefault();
    // Capturing the first Segment of Data
    const data = {
      date: $('#datePicker').val() || false,
      numberOfGuests: $('#numberOfGuests').val() || false,
      time: $('#time').val() || false,
    };

    if (Object.values(data).includes(false)) {
      $('#error-message').html(
        '<div class="alert" role="alert">Please complete all fields</div>'
      );
    } else {
      $('#error-message').html('');
      addStaffInfo(data);
    }
    setTimeout(() => {
      $('#success-message').html('');
    }, 3000);
  });
};

export default { addReservationForm };
