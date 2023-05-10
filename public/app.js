// Initialize Firebase
const firebaseConfig = {
    // TODO: Insert Firebase configuration here
  };
  firebase.initializeApp(firebaseConfig);
  
  // Get a reference to the database service
  const database = firebase.database();
  
  // Check if user is signed in and enable/disable blog form accordingly
  firebase.auth().onAuthStateChanged((user) => {
    const blogForm = document.getElementById("blog-form");
    const signInButton = document.getElementById("sign-in-button");
    
    if (user) {
      // User is signed in
      blogForm.classList.remove("disabled");
      signInButton.classList.add("d-none");
    } else {
      // User is not signed in
      blogForm.classList.add("disabled");
      signInButton.classList.remove("d-none");
    }
  });
  
  // Listen for form submissions
  document.getElementById("blog-form").addEventListener("submit", (event) => {
    event.preventDefault();
    
    // Get input values
    const username = document.getElementById("username").value;
    const blogContent = document.getElementById("blog-content").value;
    
    // Save the blog post to the database
    const blogPostRef = database.ref("blog-posts").push();
    blogPostRef.set({
      username: username,
      blogContent: blogContent
    });
    
    // Clear the form inputs
    document.getElementById("username").value = "";
    document.getElementById("blog-content").value = "";
  });
  
  // Listen for new blog posts and update the carousel
  const blogPostsRef = database.ref("blog-posts");
  blogPostsRef.on("child_added", (data) => {
    const blogPost = data.val();
    
    // Create the carousel item
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    
    // Create the username element
    const usernameElement = document.createElement("h5");
    usernameElement.textContent = blogPost.username;
    carouselItem.appendChild(usernameElement);
    
    // Create the blog content element
    const blogContentElement = document.createElement("p");
    blogContentElement.textContent = blogPost.blogContent;
    carouselItem.appendChild(blogContentElement);
    
    // Add the carousel item to the carousel
    const carouselInner = document.getElementById("blog-carousel").querySelector(".carousel-inner");
    carouselInner.appendChild(carouselItem);
    
    // If this is the first blog post, make it active
    if (carouselInner.children.length === 1) {
      carouselItem.classList.add("active");
    }
  });
  