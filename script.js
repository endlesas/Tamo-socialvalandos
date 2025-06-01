const users = {
  mokinys: 'mokinys123',
  admin: 'tamo123'
};

let jobs = [];

// Įkeliam darbų sąrašą iš localStorage
function loadJobs() {
  const saved = localStorage.getItem('jobs');
  if (saved) {
    jobs = JSON.parse(saved);
  }
}

// Išsaugom darbų sąrašą į localStorage
function saveJobs() {
  localStorage.setItem('jobs', JSON.stringify(jobs));
}

function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (users[user] && users[user] === pass) {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('loginStatus').textContent = '';
    loadJobs(); // užkraunam darbus

    if (user === 'admin') {
      document.getElementById('adminPanel').classList.remove('hidden');
      renderPendingJobs();
    } else {
      document.getElementById('userPanel').classList.remove('hidden');
      renderApprovedJobs();
    }
  } else {
    document.getElementById('loginStatus').textContent = 'Neteisingas prisijungimas';
  }
}

function submitJob(event) {
  event.preventDefault();
  const jobName = document.getElementById('jobName').value;
  const hours = document.getElementById('hours').value;
  jobs.push({ jobName, hours, approved: false });
  saveJobs(); // išsaugom naują darbą
  alert('Darbas pateiktas patvirtinimui!');
  document.getElementById('jobName').value = '';
  document.getElementById('hours').value = '';
}

function renderPendingJobs() {
  const table = document.getElementById('pendingTable');
  table.innerHTML = '<tr><th>Darbas</th><th>Valandos</th><th>Veiksmas</th></tr>';
  jobs.forEach((job, index) => {
    if (!job.approved) {
      table.innerHTML += `<tr><td>${job.jobName}</td><td>${job.hours}</td><td><button onclick="a
