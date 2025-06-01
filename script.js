const users = {
  mokinys: 'mokinys123',
  admin: 'tamo123'
};

let jobs = [];

function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (users[user] && users[user] === pass) {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('loginStatus').textContent = '';
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
  alert('Darbas pateiktas patvirtinimui!');
  document.getElementById('jobName').value = '';
  document.getElementById('hours').value = '';
}

function renderPendingJobs() {
  const table = document.getElementById('pendingTable');
  table.innerHTML = '<tr><th>Darbas</th><th>Valandos</th><th>Veiksmas</th></tr>';
  jobs.forEach((job, index) => {
    if (!job.approved) {
      table.innerHTML += `<tr><td>${job.jobName}</td><td>${job.hours}</td><td><button onclick="approveJob(${index})">Patvirtinti</button></td></tr>`;
    }
  });
}

function approveJob(index) {
  jobs[index].approved = true;
  renderPendingJobs();
  renderApprovedJobs();
}

function renderApprovedJobs() {
  const table = document.getElementById('approvedTable');
  table.innerHTML = '<tr><th>Darbas</th><th>Valandos</th></tr>';
  jobs.forEach((job) => {
    if (job.approved) {
      table.innerHTML += `<tr><td>${job.jobName}</td><td>${job.hours}</td></tr>`;
    }
  });
}
