const password =
    document.querySelector("#password");

const confirmPassword =
    document.querySelector("#confirmPassword");

document
    .querySelector(".toggle-password")
    .addEventListener("click", () => {

        password.type =
            password.type === "password"
                ? "text"
                : "password";

    });

document
    .querySelector(".toggle-confirm")
    .addEventListener("click", () => {

        confirmPassword.type =
            confirmPassword.type === "password"
                ? "text"
                : "password";

    });

document
    .querySelector("#registerForm")
    .addEventListener("submit", (e) => {

        if (
            password.value !==
            confirmPassword.value
        ) {

            e.preventDefault();

            alert(
                "As senhas não coincidem."
            );

        }

    });