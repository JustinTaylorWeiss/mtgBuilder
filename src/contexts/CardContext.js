import React, { useContext, createContext, useEffect, useState, useMemo } from 'react';
import { SearchList } from '../SearchList';

const CardContext = createContext();

export const useCards = () => useContext(CardContext);


export const CardProvider = ({ children }) => {

    const [db, setDb] = useState(false);
    const [addRemoveList, setAddRemoveList] = useState({});

    const [colorFilter, setColorFilter] = useState(
        {
            filterType: "colorIdentity",
            white: true,
            blue: true,
            black: true,
            red: true,
            green: true,
            colorless: false, 
        }
    );
    const [cardSearch, setCardSearch] = useState('');
    const [catagorySearch, setCatagorySearch] = useState('');
    const [showBannedCards, setShowBannedCards] = useState(false);
    const [deckList, setDeckList] = useState([]);
    
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState("")
    // Fetch Card Databse From API
    
    const adjustDbToAddRemovedCard = (fdb, delim) => (
        fdb.data.reduce((acc, card) => {
            const cardName = (card?.card_faces ?? false)
                ? card.card_faces[0].name + " // " + card.card_faces[1].name
                : card.name
            const numOfCard = (addRemoveList?.[card.oracle_id] ?? 1)
            return numOfCard < 1
                ? acc
                : acc + numOfCard + "x " + cardName + delim
        },"")
    )

    const colorFilterToUriText = (colorFilter) => (
        "+" + 
        (
            colorFilter.filterType === "colorIdentity"
                ? "id<%3D"
                : "c>%3D"
        ) + (
            colorFilter.colorless
            ? "C"
            : "" + 
            (colorFilter.white ? "W" : "") +
            (colorFilter.blue  ? "U" : "") +
            (colorFilter.black ? "B" : "") + 
            (colorFilter.red   ? "R" : "") +
            (colorFilter.green ? "G" : "")
        )
    );

    const buildUri = (rootUri, colorFilter) => (
        rootUri + 
        "search?order=cmc&q=" + 
        cardSearch + 
        (showBannedCards ? "" : "+f%3Acommander") + 
        colorFilterToUriText(colorFilter)
    )

    useEffect(() => {
        console.log(colorFilterToUriText(colorFilter))
        if(cardSearch !== "")
            (async () => {
                try {
                    const res = await fetch(buildUri("https://api.scryfall.com/cards/", colorFilter));
                    if(res.ok) {
                        const resJson = await res.json();
                        setDb(resJson);
                    }
                    else { throw new Error("Responce not 2xx"); }
                } catch (e) {
                    console.log(`Card Not Found (Search: ${cardSearch})`);
                }
            })()
        setDb(false);
    }, [cardSearch, setDb, colorFilter, showBannedCards]);

    // Reset Page Number Whenever A New Filter Is Applied
    useEffect(() => {
        setPage(0);
    },[cardSearch])
    
    const colorlessTrueFilter = (filterType) => ({
        filterType: filterType,
        white: false,
        blue: false,
        black: false,
        red: false,
        green: false,
        colorless: true, 
    });

    const setFilterType = (filterType) => {
        if(["colorIdentity", "color"].includes(filterType))
            setColorFilter((prevColorFilter) => ({
                ...prevColorFilter,
                filterType: filterType
            }))
    };

    const setColorOnColorFilter = (color, value) => (
        setColorFilter((prevColorFilter) => 
            color === "colorless" && value
                ? colorlessTrueFilter(prevColorFilter.filterType)
                : ({
                    ...prevColorFilter,
                    [color]: value,
                    colorless: false,
                })
        )
    );

    const pushSeachListToDeck = () => {
        if ((fdb?.data ?? false) && !fdb.has_more)
        setDeckList((prev) => [
            ...prev,
            ...adjustDbToAddRemovedCard(fdb, "^").split("^"),
        ])
    }

    const resetDeckList = () => {
        setDeckList([]);
    };

    const resetAddRemoveList = () => {
        setAddRemoveList({});
    }

    // Set FDB
    const fdb = useMemo(() => (
        db
        /*
        (async () => (
            [
            ].reduce((acc, func) => 
                func(acc)
            , db)
        ))()*/
    ), [cardSearch, db]);

    // Helper Functions
    const changePage = (delta) => {
        const newPage = page + delta;
        if (newPage > Math.ceil((fdb?.length ?? 0) / 9.0) - 1 || newPage < 0) return;
        setPage(newPage);
    };
    
    const value = {
        page,
        fdb,
        db,
        colorFilter,
        selected, setSelected,
        deckList, setDeckList,
        cardSearch, setCardSearch,
        showBannedCards, setShowBannedCards,
        catagorySearch, setCatagorySearch,
        addRemoveList, setAddRemoveList,
        changePage, setColorOnColorFilter, 
        setFilterType, adjustDbToAddRemovedCard,
        pushSeachListToDeck, resetDeckList,
        resetAddRemoveList,
    };

    return <CardContext.Provider value={value}>{children}</CardContext.Provider>
};