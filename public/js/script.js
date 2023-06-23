Array.from(document.querySelectorAll(".btn-close")).forEach(btn =>{
    setTimeout(() => {
        btn.parentNode.remove();
    }, 5000);
    btn.addEventListener("click", (e)=>{
        e.target.parentNode.remove();
    })
})