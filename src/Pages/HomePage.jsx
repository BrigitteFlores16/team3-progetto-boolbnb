import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import ImmobileCard from "../Components/ImmobileCard";
import CuoreLike from "../Components/CuoreLike";

// import carousel
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// COMPONENT EXPORT

export default function HomePage() {
  // RESPONSIVE CAROUSEL
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  //USE-STATE
  const [fetchDataImmobili, setFetchDataImmobili] = useState([]);

  // FILTERS
  const [filterCity, setFilterCity] = useState("");

  // INIT USE EFFECT
  useEffect(() => {
    handleFetchImmobili();
  }, []);

  //FETCH IMMOBILI
  const handleFetchImmobili = async (
    filterCity,
    filterRooms,
    filterBeds,
    filterType
  ) => {
    console.log(
      `http://localhost:3000/api/immobili/?city=${filterCity}&address=${filterCity}&rooms=${filterRooms}&beds=${filterBeds}&type=${filterType}`
    );

    await fetch(
      `http://localhost:3000/api/immobili/?city=${
        filterCity ? filterCity : ""
      }&address=${filterCity ? filterCity : ""}&rooms=${
        filterRooms ? filterRooms : ""
      }&beds=${filterBeds ? filterBeds : ""}&type=${
        filterType ? filterType : ""
      }`
    )
      // FILTERS
      //   ?city=${filterCity}&rooms=${filterRooms}&beds=${filterBeds}&type=${filterType}
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);

        setFetchDataImmobili(data.immobili);
      });
  };

  // * TOP 5 B&B
  // transform string in number
  const stringInNumber = (string) => {
    return parseFloat(string);
  };

  // top 5 B&B

  const handleFindTopFiveImmobili = (data) => {
    let copyFetchDataImmobili = [...data];
    const newTopFiveBnB = [];
    // console.log(fetchDataImmobili);

    for (let i = 0; i < 5; i++) {
      let maxVoto = 0;
      let immobileMaxVoto;

      const immobiliMaxVoto =
        copyFetchDataImmobili?.length &&
        copyFetchDataImmobili.map((el) => {
          const votoNumber = stringInNumber(el.voto);

          if (votoNumber > maxVoto) {
            maxVoto = votoNumber;
            immobileMaxVoto = el;
          }
        });
      newTopFiveBnB.push(immobileMaxVoto);
      const indexImmobileToDelete =
        copyFetchDataImmobili?.length &&
        copyFetchDataImmobili.findIndex((el) => el.id == immobileMaxVoto.id);
      copyFetchDataImmobili?.length &&
        copyFetchDataImmobili.splice(indexImmobileToDelete, 1);
    }
    // console.log(newTopFiveBnB);

    return newTopFiveBnB;
  };

  const topFiveBnB = handleFindTopFiveImmobili(fetchDataImmobili);
  // console.log(topFiveBnB);

  // * FUNCTION FOR LIKE
  const [colorHeart, setColorHeart] = useState("");

  const handleButtonLike = (id) => {
    fetch(`http://localhost:3000/api/immobili/${id}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {});
    colorHeart == "" && setColorHeart("red-heart");

    handleFetchImmobili();
  };

  return (
    <>
      <img
        src="/immobili-default.jpg"
        alt=""
        className="img-backgrounfd desktop-bg"
      />
      <img
        src="/background-mobile.jpg"
        alt=""
        className="img-backgrounfd mobile-bg"
      />

      <div className="container mb-5 mb-sm-5">
        {/* SEARCHBAR */}
        <Searchbar
          isHidden={true}
          fetchImmobili={handleFetchImmobili}
          filterCity={filterCity}
          setFilterCity={setFilterCity}
        />

        {/* top 5 b&b */}
        <div className="top-five-bnb-container">
          <div className="top-five-bnb">
            {topFiveBnB?.length &&
              topFiveBnB.map((el, i) => {
                // console.log(topFiveBnB);
                return (
                  <ImmobileCard
                    key={i}
                    immobile={el}
                    section={"top-5"}
                    refreshData={() => handleFetchImmobili("", "", "", "")}
                  />
                );
              })}
          </div>
          <h3 className="top-5-title-absolute">
            <i className="fa-solid fa-bolt"></i>Top 5 B&B
            <i className="fa-solid fa-bolt"></i>
          </h3>
        </div>

        {/* carousel */}
        <div className="carousel-main-container">
          <h3 className="top-5-title">Top 5 B&B</h3>
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            customTransition="all .5"
            transitionDuration={1000}
            containerClass="carousel-container"
            itemClass="carousel-item-padding-40-px"
          >
            {topFiveBnB?.length &&
              topFiveBnB.map((el, id) => {
                return (
                  <>
                    <CuoreLike
                      key={el && el.id}
                      functionLike={() => handleButtonLike(el.id)}
                      colorHeart={colorHeart}
                      isAbsolute={true}
                      numLike={el && el.num_likes}
                      className="cuore"
                    />
                    <Link to={`/${el && el.id}`} key={id} className="">
                      <div className="img-carousel-container">
                        <img
                          src={el && el.immagine}
                          className="h-100 carousel-image"
                          alt=""
                        />
                      </div>
                      <h2 className="text-center py-4">{el && el.titolo}</h2>

                      <div className="immobile-card-body-content d-flex justify-content-between px-2">
                        {/* <span className="immobile-content-like">
                          <i className="fa-solid fa-heart cardComforts icona"></i>{" "}
                          {el && el.num_likes}
                        </span>{" "} */}
                        {/* <br /> */}
                        <span className="immobile-content-adress">
                          <i className="fa-solid fa-map-pin cardComforts icona"></i>{" "}
                          {el && el.indirizzo}
                        </span>
                        <span className="immobile-content-room">
                          <i className="fa-solid fa-door-open cardComforts icona"></i>{" "}
                          {el && el.num_stanze}
                        </span>
                        <span className="immobile-content-bathroom">
                          <i className="fa-solid fa-shower cardComforts icona"></i>{" "}
                          {el && el.num_bagni}
                        </span>
                        <span className="immobile-content-meters">
                          <i className="fa-solid fa-ruler cardComforts icona"></i>{" "}
                          {el && el.mq}
                        </span>
                        <span className="immobile-content-star">
                          <i className="fa-solid fa-star cardComforts icona"></i>
                          {parseFloat(el && el.voto).toFixed(1)}
                        </span>
                      </div>
                    </Link>
                  </>
                );
              })}
          </Carousel>
        </div>

        {/* ! PRESENTATION */}
        <div className="background-container">
          <div className="container">
            <div className="presentation-container">
              <h1 className="text-center mb-5">Chi siamo</h1>

              <hr />
              <div className="p-3 p-md-5">
                <div className="row g-5">
                  <div className="col-12 col-sm-6">
                    <img
                      className="img-fluid rounded-4
                    "
                      src="img/nature.jpeg"
                      alt=""
                    />
                  </div>

                  <div className="col-12 col-sm-5 order-1 d-flex align-items-center">
                    <div className="">
                      <h2>La nostra compagnia</h2>
                      <span>
                        Siamo un team appassionato che mette al centro la
                        qualità e la soddisfazione dei nostri clienti. Il nostro
                        obiettivo è offrirti un’esperienza di soggiorno unica,
                        con una selezione di case vacanze curate nei minimi
                        dettagli. Grazie alla nostra esperienza nel settore,
                        garantiamo un servizio affidabile, trasparente e sempre
                        disponibile per rispondere a ogni tua esigenza. Che tu
                        stia cercando un rifugio in montagna, una villa sul mare
                        o un appartamento in città, troverai la soluzione
                        perfetta per te!
                      </span>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 order-3 order-sm-2 d-sm-flex flex-column align-items-end justify-content-center">
                    <h2>I nostri affittuari</h2>
                    <span className="text-end">
                      Collaboriamo con proprietari affidabili e professionali
                      per offrirti solo le migliori strutture. Ogni casa è
                      attentamente selezionata e verificata per garantire
                      comfort, pulizia e sicurezza. Inoltre, i nostri affittuari
                      si impegnano a fornire un'accoglienza calorosa e un
                      servizio attento, così potrai sentirti a casa anche
                      lontano da casa. Leggi le recensioni di altri ospiti e
                      prenota in totale serenità, sapendo di scegliere una
                      struttura di qualità con un host fidato.
                    </span>
                  </div>

                  <div className="col-12 col-sm-6 order-2 order-sm-3">
                    <img
                      className="img-fluid rounded-4"
                      src="img/image-presentazione.jpg"
                    />
                  </div>

                  <div className="col-12 col-sm-6 order-4">
                    <img
                      className="img-fluid rounded-4"
                      src="img/payment.jpg"
                    />
                  </div>

                  <div className="col-12 col-sm-6 order-5 d-flex flex-column align-items-start justify-content-center">
                    <h2>Pagamenti sicuri</h2>
                    <span>
                      La sicurezza nelle transazioni è una nostra priorità
                      assoluta. Offriamo metodi di pagamento protetti, con
                      transazioni crittografate e sistemi antifrode, così da
                      garantire la massima tranquillità ai nostri clienti.
                      Inoltre, disponiamo di politiche di cancellazione
                      flessibili e assistenza dedicata per risolvere qualsiasi
                      problema legato ai pagamenti. Prenota con fiducia, sapendo
                      che ogni transazione è gestita con la massima sicurezza e
                      trasparenza.
                    </span>
                  </div>
                </div>
              </div>

              <div className="end-description-container mt-5">
                <h2>Cosa aspetti, prenota subito!</h2>
                <Link to="/search">
                  <button className="btn mt-5 mb-5 btn-end-page">
                    Ricerca un alloggio
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
