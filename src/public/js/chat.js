
const socket = io()
let user;
let form = document.getElementById('form')
let chatBox = document.getElementById('chatBox')


swal.fire({
    input: 'email',
    text: "Ingrese su email",
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
form.addEventListener('submit', e => {
    e.preventDefault();
    const inputValue = chatBox.value.trim();

    if (inputValue.length > 0) {
        socket.emit("message", { user: user, message: inputValue })
        chatBox.value = ''
    }

})

socket.on('chat_message', async data => {

    let logs = document.getElementById('messagesLogs')

    console.log(data)
    const listMessage = document.createElement('ul');
    data.forEach(mensajes => {
        listMessage.innerHTML = `
        <li>Nombre: ${mensajes.user} mensaje: ${mensajes.message} </li>
        `;
        logs.appendChild(listMessage);
    });

})


