async function loadListings() {

    try {

        const response = await fetch("/api/listings");

        const listings = await response.json();

        const grid = document.getElementById("listingGrid");

        grid.innerHTML = "";

        listings.forEach(listing => {

            grid.innerHTML += `
                <div class="listing-card">

                    <div class="listing-image">

                        <h1 style="text-align:center;padding-top:60px;font-size:60px;">
                            ${listing.image}
                        </h1>

                    </div>

                    <h3>${listing.title}</h3>

                    <p>${listing.location}</p>

                    <strong>KES ${listing.price}/day</strong>

                </div>
            `;

        });

    }

    catch(error){

        console.error(error);

    }

}

loadListings();

const overlay = document.getElementById("authOverlay");

const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");

document.getElementById("openLogin")?.addEventListener("click",(e)=>{

    e.preventDefault();

    overlay.classList.add("show");

    loginView.style.display="block";
    registerView.style.display="none";

});

document.getElementById("openRegister")?.addEventListener("click",(e)=>{

    e.preventDefault();

    overlay.classList.add("show");

    loginView.style.display="none";
    registerView.style.display="block";

});

document.getElementById("closeAuth")?.addEventListener("click",()=>{

    overlay.classList.remove("show");

});

overlay?.addEventListener("click",(e)=>{

    if(e.target===overlay){

        overlay.classList.remove("show");

    }

});

document.getElementById("showRegister")?.addEventListener("click",()=>{

    loginView.style.display="none";
    registerView.style.display="block";

});

document.getElementById("showLogin")?.addEventListener("click",()=>{

    registerView.style.display="none";
    loginView.style.display="block";

});