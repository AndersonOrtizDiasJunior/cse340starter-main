const form = document.querySelector("#updateForm")
console.log("form aquiu ó ")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    })