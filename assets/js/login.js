// Validar usuario e senha
let validarLogin = document.querySelector(".validar-login")
validarLogin.addEventListener("click", () => {
    let usuarioLogin = document.getElementById("usuario-login").value
    let senhaLogin = document.getElementById("senha-login").value

    // Recuperar a lista de usuários do localStorage
    const usuariosJSON = localStorage.getItem("usuarios")
    let usuarios =  usuariosJSON ? JSON.parse(usuariosJSON) : []

    // Remover popup quando clicar no button "OK"
    document.querySelector(".fechar-popup-login").addEventListener("click", () => {
        document.querySelector(".box-popup-login").classList.remove("box-popup-login-active")
    })

    // Verificar se existe usuarios com as credenciais fornecidas
    const usuarioValido = usuarios.find(user => user.usuario === usuarioLogin && user.senha === senhaLogin)

    if(usuarioValido) {
        window.location.href = "pagina-principal.html"
        document.getElementById("usuario-login").value = ""
        document.getElementById("senha-login").value = ""
    } else{
        document.getElementById("usuario-login").value = ""
        document.getElementById("senha-login").value = ""
        document.querySelector(".box-popup-login").classList.add("box-popup-login-active")
    }
})