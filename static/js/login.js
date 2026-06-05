const toggleButton =
    document.querySelector(".toggle-password");

const passwordInput =
    document.querySelector("#password");

toggleButton.addEventListener("click", () => {

    const isPassword =
        passwordInput.type === "password";

    passwordInput.type =
        isPassword
            ? "text"
            : "password";

    toggleButton.innerHTML =
        isPassword
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';

});