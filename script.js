// local stroge will be store id of every meal element
// if localstroge is empty then push a array with key value "favouriteslist"
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}



// this function fetches meals from api and return it
async function fetchMealsFromApi(url, value) {
    const response = await fetch(`${url + value}`);
    const data = await response.json();
    return data;
}

//displays the searched meal
function showMealList() {
    let inputValue = document.getElementById("search").value.trim();
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    let meals = fetchMealsFromApi(url, inputValue);
    meals.then(data => {
        // if meals are present that input by user then this html elements will be add
        if (data.meals) {
            //data.meals structure =[{},{},{},{},{}.....]--array of meal object
            data.meals.forEach((meal) => {
                let isFav=false;
                // check for meal is favorite or not by array of id which store in localstroge
                for (let index = 0; index < arr.length; index++) {
                    if(arr[index]==meal.idMeal){
                        isFav=true;
                    }
                }
                // if it's favorite then this html element will be add
                if (isFav) {
                    //here also two function added and parameter is id of meal ---1.showMealDetails(id) 2. addRemoveToFavList(id)
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title ">${meal.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-warning" onclick="showMealDetails(${meal.idMeal})">Recipe</button>
                            <button id="main${meal.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${meal.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                }
                // if it's not favorite then this html element will add
                //here also two function added and parameter is id of meal ---1.showMealDetails(id) 2. addRemoveToFavList(id)
                else {
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-warning" onclick="showMealDetails(${meal.idMeal})">Recipe</button>
                            <button id="main${meal.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${meal.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                }  
            });
        } 
        // If Not present data then this html elements will be add
        else {
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center" ">
                
                            <div class="mb-4 lead white">
                                The meal you are looking for was not found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        // after store all elements in html all element will be add in "#recipe-list" container
        document.getElementById("recipe-list").innerHTML = html;
    });
}


//if user click Recipe then this function will be exicute by that meal id
async function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMealsFromApi(url, id).then(data => {
        // this will be return a array of one object that is the reason I use data.meals[0]
        html += `
          
    <div class="container py-3">
    <div class="card p-lg-5 p-md-2">
        <div class="row ">
            <div class="col-md-4  align-self-center">
                <img src="${data.meals[0].strMealThumb}" class="w-100">
            </div>
            <div class="col-md-8 px-3 align-self-center">
                <div class="card-block px-3">
                    <div id="heading" class="text-center">

                    </div>
                    <h2 class="card-title" id="heading2">${data.meals[0].strMeal}</h2>
                    <p id="category">Category : ${data.meals[0].strCategory}</p>
                    <p d="area">Area : ${data.meals[0].strArea}</p>


                    <h5>Instruction :</h5>
                    <p class="card-text" id="recipe-intro">
                        ${data.meals[0].strInstructions}</p>
                    <a href="${data.meals[0].strYoutube}"  target="_blank" class="btn btn-warning">Video</a>

                    
                </div>
            </div>

        </div>
    </div>
</div>

        `;
    });
     // after store all elements in html all element will be add in "#recipe-list" container
    document.getElementById("recipe-list").innerHTML = html;
}


// it shows all favourites meals in favourites body
async function showFavMealList() {
    // get all id from local storage those id of meal will be favorites meal
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    // If array length is zero no meal added in my favourites list
    if (arr.length==0) {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
            
                            <div class="mb-4 lead heading2 white">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    }
    // if localstroge array is not empty that means favourites meal are present
    else {
        // for get all id of meal use for loop
        for (let index = 0; index < arr.length; index++) {
            // for every id fetch data by API use ID and add in html 
            await fetchMealsFromApi(url,arr[index]).then(data=>{
                html += `
                <div id="card" class="card mb-3 m-2" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-warning" onclick="showFavMealDetails(${data.meals[0].idMeal})">Recipe</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa fa-trash" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
                `;
            });   
        }
    }
    // After all html elements add in html 
    // html will be add in "favourite-list" container---this will be take a time beacause many promise call in inside for loop
    document.getElementById("favorite-list").innerHTML= html;
}

//it  shows fulldetails of meal same way by user click Recipe
async function showFavMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMealsFromApi(url, id).then(data => {
        html += `
          
    <div class="container py-3">
    <div class="card card p-lg-5 p-md-2">
        <div class="row ">
            <div class="col-md-4  align-self-center">
                <img src="${data.meals[0].strMealThumb}" class="w-100">
            </div>
            <div class="col-md-8 px-3 align-self-center">
                <div class="card-block px-3">
                    <div id="heading" class="text-center">

                    </div>
                    <h2 class="card-title" id="heading2">${data.meals[0].strMeal}</h2>
                    <p id="category">Category : ${data.meals[0].strCategory}</p>
                    <p d="area">Area : ${data.meals[0].strArea}</p>


                    <h5>Instruction :</h5>
                    <p class="card-text" id="recipe-intro">
                        ${data.meals[0].strInstructions}</p>
                    <a href="${data.meals[0].strYoutube}"  target="_blank" class="btn btn-warning">Video</a>
                </div>
            </div>

        </div>
    </div>
</div>

        `;
    });
    document.getElementById("favorite-list").innerHTML = html;
}



//adding and removal of the favoite list
function addRemoveToFavList(id) {
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let contain=false;
    // if id is present localstroge then contain will be true
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        }
    }
    // if meal is favourite then remove it's id from local storage
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("your meal removed from your favourites list");
    } 
    // if meal is not favourite then push id inside array of localstorage
    else {
        arr.push(id);
        alert("your meal add your favourites list");
    }
    // Local storage will be update
    localStorage.setItem("favouritesList",JSON.stringify(arr));

    // And re render full meal list and favourite list
    showFavMealList();
    showMealList();
}

