
var mouseX;
var mouseY;

document.addEventListener('click', (e) => {
buttons = document.querySelectorAll("#copy")
buttons.forEach((button) => {
  button.style.backgroundColor = "var(--secondary)"
})
}, true);


// set up close listeners for modals
closeButtons = document.querySelectorAll('.close')
closeButtons.forEach(element => {
  element.addEventListener('click', () =>{
    dialogs = document.querySelectorAll('.modal')
    dialogs.forEach((dialog) => {
      dialog.close()
    })
  
  })
})

function sortByLanguage() {
  lang = document.getElementById('lang_dropdown').value
  document.querySelectorAll("#snippet").forEach((snippet) => {
    if (snippet.dataset.lang == lang || lang == "all") {
      snippet.style.display = "block"
    } else {
      snippet.style.display = "none"
    }
  })
}

// update page
function exportSnippets() {
  window.world.exportSnippets()
  console.log("exporting...")
}

// Display modal
function showModal(e) {
  document.getElementsByTagName('html')[0].classList.remove('modal-is-closing')
  document.getElementsByTagName('html')[0].classList.add('modal-is-opening')
  dialog = document.getElementById(e.dataset.type)
  console.log(dialog)
  dialog.showModal()
}


// function to actually add new element
function saveSnippet() {
  document.getElementsByTagName("html")[0].classList.add('modal-is-closing')
  console.log('added')
  document.getElementById('snippetModal').close()

  const name = document.getElementById('snippetName').value
  const data = document.getElementById('snippetContent').value
  const lang = document.getElementById('language').value
  console.log(lang)
  window.world.saveSnippet(name, data.trim(), lang) 
}

// edit snippet
function editSnippet(element) {
  const snippet = document.getElementById(element.dataset.snip)
  const edit = document.getElementById(element.dataset.snip+"_edit")

  snippetNameInput = document.getElementById("snippetName")
  content = document.getElementById("snippetContent")
  language = document.getElementById("language")


  snippetNameInput.value = element.dataset.snip 
  content.value = snippet.innerText.trim()
  language.value = element.dataset.lang

  showModal(element)
}


// function to remove snippet
function deleteSnippet(element) {
  var snippetName = element.dataset.snip
  var lang = element.dataset.lang
  console.log(snippetName)
  window.world.deleteSnippet(snippetName, lang) 
}

// function to save a new category
function saveCategory() {
  var name = document.getElementById('categoryName').value
  console.log(name)
  window.world.saveCategory(name)
  document.getElementById('categoryModal').close()
}

function copyToClipboard(element) {
    // Get the pre tag
    var pre = document.getElementById(element.dataset.snip)

     // Copy the text inside the pre field
    navigator.clipboard.writeText(pre.innerText);

    element.style.backgroundColor = "green"
    element.innerText = "copied!"
    

}

