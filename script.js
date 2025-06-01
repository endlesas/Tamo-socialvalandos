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
      tdStatus.className = job.approved ? 'status-approved' : 'status-pending';
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

document.getElementById('jobForm').addEventListener('submit', e => {
  e.preventDefault();

  const jobName = document.getElementById('jobName').value.trim();
  const hours = parseFloat(document.getElementById('hours').value);

  if (!jobName || isNaN(hours) || hours <= 0) {
    alert('Įveskite teisingus duomenis');
    return;
  }

  jobs.push({ user: currentUser, jobName, hours, approved: false });
  saveJobs();
  renderUserJobs();

  document.getElementById('jobForm').reset();
});

function renderPendingJobs() {
  const tbody = document.querySelector('#pendingTable tbody');
  tbody.innerHTML = '';

  jobs.forEach((job, idx) => {
    if (!job.approved) {
      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.textContent = job.jobName;
      tr.appendChild(tdName);

      const tdHours = document.createElement('td');
      tdHours.textContent = job.hours;
      tr.appendChild(tdHours);

      const tdAction = document.createElement('td');
      const btnApprove = document.createElement('button');
      btnApprove.textContent = 'Patvirtinti';
      btnApprove.onclick = () => {
        jobs[idx].approved = true;
        saveJobs();
        renderPendingJobs();
      };
      tdAction.appendChild(btnApprove);
      tr.appendChild(tdAction);

      tbody.appendChild(tr);
    }
  });
}
