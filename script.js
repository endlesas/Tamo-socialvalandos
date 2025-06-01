const users = {
  mokinys: 'mokinys123',
  admin: 'tamo123'
};

let jobs = [];
let currentUser = null;

function loadJobs() {
  const saved = localStorage.getItem('jobs');
  if (saved) {
    jobs = JSON.parse(saved);
  }
}

function saveJobs() {
  localStorage.setItem('jobs', JSON.stringify(jobs));
}

function login() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();

  if (users[user] && users[user] === pass) {
    currentUser = user;
    document.getElementById('login').classList.add('hidden');
    document.getElementById('loginStatus').textContent = '';
    loadJobs();

    if (user === 'admin') {
      document.getElementById('adminPanel').classList.remove('hidden');
      renderPendingJobs();
    } else {
      document.getElementById('userPanel').classList.remove('hidden');
      renderUserJobs();
    }
  } else {
    document.getElementById('loginStatus').textContent = 'Neteisingas prisijungimas';
  }
}

function logout() {
  currentUser = null;
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('userPanel').classList.add('hidden');
  document.getElementById('login').classList.remove('hidden');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

function renderUserJobs() {
  const tbody = document.querySelector('#jobsTable tbody');
  tbody.innerHTML = '';

  let approvedHours = 0;
  let pendingHours = 0;

  jobs.forEach(job => {
    if (job.user === currentUser) {
      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.textContent = job.jobName;
      tr.appendChild(tdName);

      const tdHours = document.createElement('td');
      tdHours.textContent = job.hours;
      tr.appendChild(tdHours);

      const tdStatus = document.createElement('td');
      tdStatus.textContent = job.approved ? 'Patvirtintas' : 'Laukia patvirtinimo';
      tr.appendChild(tdStatus);

      tbody.appendChild(tr);

      if (job.approved) {
        approvedHours += parseFloat(job.hours);
      } else {
        pendingHours += parseFloat(job.hours);
      }
    }
  });

  document.getElementById('approvedHours').textContent = approvedHours.toFixed(1);
  document.getElementById('pendingHours').textContent = pendingHours.toFixed(1);
}

document.getElementById('jobForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const jobName = document.getElementById('jobName').value.trim();
  const hours = parseFloat(document.getElementById('hours').value);

  if (!jobName || isNaN(hours) || hours <= 0) {
    alert('Įveskite tinkamus duomenis');
    return;
  }

  jobs.push({
    user: currentUser,
    jobName,
    hours,
    approved: false
  });

  saveJobs();
  renderUserJobs();

  document.getElementById('jobName').value = '';
  document.getElementById('hours').value = '';
  alert('Darbas pateiktas patvirtinimui!');
});

function renderPendingJobs() {
  const tbody = document.querySelector('#pendingTable tbody');
  tbody.innerHTML = '';

  jobs.forEach((job, index) => {
    if (!job.approved) {
      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.textContent = job.jobName;
      tr.appendChild(tdName);

      const tdHours = document.createElement('td');
      tdHours.textContent = job.hours;
      tr.appendChild(tdHours);

      const tdAction = document.createElement('td');
      const btn = document.createElement('button');
      btn.textContent = 'Patvirtinti';
      btn.onclick = () => approveJob(index);
      tdAction.appendChild(btn);
      tr.appendChild(tdAction);

      tbody.appendChild(tr);
    }
  });
}

function approveJob(index) {
  jobs[index].approved = true;
  saveJobs();
  renderPendingJobs();
}



button:hover {
  background-color: #005a9e;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

table th {
  background-color: #0078d7;
  color: white;
}

.summary p {
  font-size: 16px;
  margin: 5px 0;
}

.error {
  color: red;
  margin-top: -10px;
  margin-bottom: 10px;
}

.hidden {
  display: none;
}

