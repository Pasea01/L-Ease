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