/* Validação no lado do cliente */
let form = document.querySelector(".validator");
let validator = {
    handleSubmit(event) {
        event.preventDefault();

        let send = true;

        let inputs = form.querySelectorAll("input");

        inputs.forEach((input) => {
            let check = validator.checkInput(input);

            if (check !== true) {
                send = false;
                validator.showError(input, check);
            }
        })

        if (send) {
            alert("Enviado com sucesso!");
            return;
        }
    },
    checkInput(input) {
        let rules = input.getAttribute("data-rules");
        if (rules !== null) {
            rules = rules.split("|");

            for (k in rules) {
                let rDetails = rules[k].split("=");
                switch (rDetails[0]) {
                    case "required":
                        if (input.value == "") {
                            return "Campo obrigatório!"
                        }
                        break;
                    case "min":
                        if (input.value.length < rDetails[1]) {
                            return "Campo deve ter pelo menos " + rDetails[1] + " caractêres!";
                        }
                        break;
                    case "email":
                        if (input.value != " ") {
                            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                            if (!regex.test(input.value.toLowerCase())) {
                                return "Deve ser um email válido!"
                            }
                        }
                        break;
                }
            }
        }

        return true;
    },
    showError(input, check) {
        input.style.borderColor = "red";
        let avisoPlaceholder = input.getAttribute("placeholder");
        let value = input.value;
        input.setAttribute("placeholder", check);
        input.value = "";
        input.addEventListener("click", () => input.style.borderColor = "")
        setTimeout(() => {
            input.setAttribute("placeholder", avisoPlaceholder);
            input.value = value;
        }, 1700)
    }
}

form.addEventListener("submit", validator.handleSubmit);
let counter = 0;
let path = "./images/";
let imgsSub = []

for (let i = 1; i <= 14; i++) {
    if (i == 3 || i == 4 || i == 5 || i == 10) {
        imgsSub.push(path + "apex" + i + ".png")
    } else {
        imgsSub.push(path + "apex" + i + ".jpg")
    }

}

console.log(imgsSub)

function alternarBackground(images) {
    if (images == undefined) {
        images = localStorage.getItem("imgs");
        images = images.split(",");
    }


    let leftSide = document.querySelector(".leftside");
    if (counter > images.length - 1) {
        counter = 0;
    }


    new Image().src = images[counter];
    setTimeout(() => {
        leftSide.style.backgroundImage = "url('" + images[counter++] + "')";
    }, 2000);

}

let images = [];

if (!localStorage.getItem("imgs")) {
    $.ajax({
        url: "./images",
        success: (data) => {
            $(data).find("#files > li a").each((_, i) => {
                if (i.getAttribute("href").indexOf("apex") > -1 || i.getAttribute("href").indexOf("/form") == -1) {
                    images.push(i.getAttribute("href"))
                }
            })

            /* alternarBackground(images); */
            localStorage.setItem("imgs", images)
        },
        error: () => {
            setInterval(() => alternarBackground(imgsSub), 4000)
        }
    })
}




function showForm() {

    let telaLoading = document.querySelector(".loading--screen");
    let playingMusicTheme = () => {
        let audioPlayer = document.querySelector("audio");
        audioPlayer.volume = 0.1;
        audioPlayer.play();

        audioPlayer.onended = () => {
            audioPlayer.currentTime = 0;
            audioPlayer.play()
        }
    }
    playingMusicTheme();
    telaLoading.setAttribute("style", "opacity:0;transition:all ease 0.3s");
    setTimeout(() => {
        telaLoading.setAttribute("style", "display:none");
        alternarBackground();
    }, 1000);
    setInterval(alternarBackground, 4000);
}

function initializing() {
    document.querySelector(".loading--screen").innerHTML = "<button onclick='showForm()'>Exibir Formulário</button>"
}

document.onreadystatechange = () => (document.readyState === "complete") && setTimeout(initializing, 2000);

