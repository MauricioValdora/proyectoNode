
const socket = io()
let user;
let chatBox = document.getElementById('chatBox')

swal.fire({
    title: "Identifiquese",
    input: 'email',
    text: "Ingrese su nombre",
    icon: "success",
    inputValidator: (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            return 'Necesitas ingresar un correo electrónico para continuar';
        } else if (!emailPattern.test(value)) {
            return 'Ingresa un correo electrónico válido';
        }
    },
    allowOutsideClick: false
})
    .then(result => {
        user = result.value
    });
socket.on()
chatBox.addEventListener('keyup', e => {
    if (e.key === "Enter") {
        const inputValue = chatBox.value.trim();

        if (inputValue.length > 0) {
            socket.emit("message", { user: user, message: inputValue })
            chatBox.value = ''
        }
    }
})

socket.on('chat_message', async data => {
    let logs = document.getElementById('messagesLogs')
    let messages = ""
    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message} </br>`
    })
    logs.innerHTML = messages
    console.log(data)
})


