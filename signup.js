 document.getElementById("signupForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Please fill out all fields!");
        return;
      }

      // Save credentials to localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);

      alert("✅ Account created successfully!");
      window.location.href = "index.html";
    });