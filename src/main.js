import "../style.css";

// Constants
const ENDPOINT_COMPLETIONS = "https://api.openai.com/v1/chat/completions";
const ENDPOINT_IMAGES = "https://api.openai.com/v1/images/generations";

// Global variables
let API_KEY;

document.addEventListener("DOMContentLoaded", () => {
  API_KEY = localStorage.getItem("openai_api_key");

  if (!API_KEY) {
    alert(
      "Please store your API key in local storage with the key 'openai_api_key'.",
    );
    return;
  }

  const mangaInputForm = document.getElementById("mangaInputForm");
  mangaInputForm.addEventListener("submit", handleFormSubmission);
});

// Helper functions
async function getBlurb(title, theme) {
  try {
    const response = await fetch(ENDPOINT_COMPLETIONS, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      }, 
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "user",
            "content": `Generate an interesting manga blurb based on the  given title, (${title}), and theme,(${theme}). The blurb should 
            be concise, about one paragraph in length. Please only include the blurb and do not include the title.`
          }
        ]
      })
    });

    const data = await response.json();
    const generatedBlurbs = data.choices.map(choice => choice.message.content);
    return generatedBlurbs;
  } catch (error) {
    console.log(error);
    alert("Error receiving  an OpenAI chat request!");
  }
}

// Use  OpenAI API to generate a manga cover image from the generated blurb
async function getCoverImage(blurb) { 

  try {
    const res = await fetch(ENDPOINT_IMAGES, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      }, 
      body: JSON.stringify({
        prompt: `Generate a manga front cover image of the blurb given: (${blurb})`,
        n: 1
      })
    });
    const data = await res.json();
    const urlOfImage = data.data.map(imageObj =>
    imageObj.url
    );
    return urlOfImage;
  } catch(error) {
    console.log(error);
    alert("error getting an OpenAI image request!");
  } 
      
  
}

// Event handlers
// handleFormSubmission(e) is called when form is submitted 
async function handleFormSubmission(e) {

  e.preventDefault();

  //get the title and theme from the form.
  const mangaTitle = document.getElementById("mangaTitle");
  const mangaTheme = document.getElementById("mangaTheme");
  const createdBlurb = document.getElementById("generatedBlurb");  
  const coverImageID =  document.getElementById("coverImage");  
  const submitBtn = document.getElementById("generateButton"); 
  const loadData = document.getElementById("spinner") 

  // alert if theme and/or title are missing 
  if (mangaTitle.value === "" && mangaTheme.value === "") {
    alert("Title and theme are missing!");
    return;
  } 

  if (mangaTitle.value !== "" && mangaTheme.value === "")  { 
    alert("Theme is missing!");
    return;
  }

  if (mangaTitle.value === "" && mangaTheme.value !== "") { 

    alert("Title is missing"); 
    return; 
  }

  // clear previous blurb and image when submitting
  createdBlurb.classList.add("hidden");
  coverImageID.classList.add("hidden");

  // disable user's inputs when submitting
  mangaTitle.disabled = true;
  mangaTheme.disabled = true;

  // hide submit button and add spinner when submitting 
  submitBtn.classList.add("hidden");
  loadData.classList.remove("hidden");
  
  let newBlurb; 
  // call to getBlurb and getImages to generate manga blurb/image
  try {
    newBlurb = await getBlurb(mangaTitle.value, mangaTheme.value);
    const generatedBlurb = createdBlurb;
    //update DOM to show the new blurb

    generatedBlurb.textContent = newBlurb.join('\n');
    generatedBlurb.classList.remove("hidden");
  } catch (err) {
    console.log(err);
    alert("Error generating blurb");

  } 

  try {
    const url = await getCoverImage(newBlurb);
    const coverImage = coverImageID;
    //update the DOM to display the image once received.
    coverImage.src = url;
    coverImage.classList.remove("hidden");
  } catch(err) {
    console.log(err);
    alert("Error generating cover image");
     // execute even if exception 
  } finally { 
    // allow user editing 
    mangaTitle.disabled = false;
    mangaTheme.disabled = false;
    document.getElementById("generateButton").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
}
