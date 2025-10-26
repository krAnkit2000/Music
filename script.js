//   document.getElementById('loginForm').addEventListener('submit', (e) => {
//       e.preventDefault();
//       const email = document.getElementById('email').value.trim();
//       const password = document.getElementById('password').value.trim();

//       if (email && password) {

//         localStorage.setItem('isLoggedIn', 'true');
   
//         window.location.href = 'index.html';
//       } else {
//         alert('Please enter both email and password.');
//       }
//     });

//  document.getElementById('loginForm').addEventListener('submit', (e) => {
//     e.preventDefault();
//     const email = document.getElementById('email').value.trim();
//     const password = document.getElementById('password').value.trim();


//     const correctEmail = "user@example.com";
//     const correctPassword = "12345";

//     if (email === correctEmail && password === correctPassword) {
//       localStorage.setItem('isLoggedIn', 'true');
//       window.location.href = 'index.html';
//     } else {
//       alert('❌ Wrong email or password!');
//     }
//   });

const storedEmail = localStorage.getItem("userEmail");
const storedPassword = localStorage.getItem("userPassword");

    document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

     if (email === storedEmail && password === storedPassword) {
  localStorage.setItem("isLoggedIn", "true");
  window.location.href = "index.html";
} else {
  alert("❌ Incorrect email or password");
}

    });






