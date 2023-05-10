// Get a reference to the Firestore database service
var db = firebase.firestore();

// Check for authentication state changes when the page loads
window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    const blogForm = document.getElementById("blog-form");
    const signInButton = document.getElementById("sign-in-button");
    
    signInButton.addEventListener('click', () => {
      // Create a new instance of the Google provider object
      const provider = new firebase.auth.GoogleAuthProvider();

      // Sign in with Google
      auth.signInWithPopup(provider)
        .then((result) => {
          // Handle successful sign-in
          const user = result.user;
          console.log(`Signed in as ${user.displayName}`);
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
        });
    });

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
};

// Handle form submit event
document.getElementById('blog-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get form values
  var username = document.getElementById('username').value;
  var blog = document.getElementById('blog').value;

  // Add the blog to the Firestore database if user is authenticated
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      db.collection('blogs').add({
        username: username,
        blog: blog,
        userId: user.uid
      }).then(function(docRef) {
        console.log('Document written with ID: ', docRef.id);
      }).catch(function(error) {
        console.error('Error adding document: ', error);
      });
    } else {
      console.log('User is not signed in');
    }
  });

  // Reset the form
  document.getElementById('blog-form').reset();
});

// Listen for changes to the blog collection
db.collection('blogs').where('userId', '==', firebase.auth().currentUser.uid).onSnapshot(function(querySnapshot) {
  var blogs = [];

  querySnapshot.forEach(function(doc) {
    // Convert Firestore document to JavaScript object
    var blog = doc.data();

    // Add the blog to the blogs array
    blogs.push(blog);
  });

  // Display the blogs in the carousel
  displayBlogs(blogs);
});

// Display the blogs in the carousel
function displayBlogs(blogs) {
  var carouselItems = '';

  blogs.forEach(function(blog, index) {
    var activeClass = index === 0 ? 'active' : '';

    carouselItems += `
      <div class="carousel-item ${activeClass}">
        <h5>${blog.username}</h5>
        <p>${blog.blog}</p>
      </div>
    `;
  });

  document.querySelector('#blog-carousel .carousel-inner').innerHTML = carouselItems;
}
