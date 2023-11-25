import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { useCards } from "../contexts/CardContext";
import rotate from "./icons/rotate.png";
import plus from "./icons/plus.svg";
import minus from "./icons/minus.svg";
import W from "./colorIcons/W.svg";
import U from "./colorIcons/U.svg";
import B from "./colorIcons/B.svg";
import R from "./colorIcons/R.svg";
import G from "./colorIcons/G.svg";
import C from "./colorIcons/C.svg";


const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`

const Row = styled.div`
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;
const Wrapper = styled.div`
    margin-top: 20px;
    font-size: 3rem;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const Label = styled.label`
    margin-right: 10px;
`;

const SmallLabel = styled.label`
    margin-left: 30px;
    font-size: 1.5rem;
`;

const FlipIcon = styled.img`
`;

const Vl = styled.span`
    border-left: 4px solid lightgray;
    height: 40px;
    margin: 0 20px;
`;

const Img = styled.img`
`;

const CheckBox = styled.input`
    width: 30px;
    height: 30px;
    margin: 20px;
`;

const H4 = styled.h4`
    font-weight: normal;
`;

const Search = styled.input`
    margin: 40px;
    width: 25vw;
    height: 60px;
    font-size: 2rem;
`;

const SubSearch = styled.input`
    margin: 40px;
    width: 15vw;
    height: 60px;
    font-size: 2rem;
`;

const CardWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 0 20px 40px 20px;
`;

const FlipCardButton = styled.button`
    display: inline-block;
    position: static; 
    height: 70px;
    border: none;
    margin: 0 30px;
    background-color: transparent;
    border-radius: 10px;
    &:hover {
        background-color: rgba(255, 255, 255, 0.7);
    }
    &:active {
        background-color: rgba(255, 255, 255, 1);
    }
`

const Select = styled.select`
    font-size: 2rem;
    padding: 5px 10px;
    margin: 10px;
`;

const CardQuantityWrap = styled.div`
    display:flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 70px;
    text-align: center;
    width: 100%;
    color: black;
    font-size: 3rem;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 6px;
`;

const CardQuantity = styled.div`
    padding: 0 10px;
    margin: 5px;
`;
const AddRemoveCard = styled.img`
    box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
`;

const Option = styled.option``;

const CardNameWrap = styled.div`
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 0;
    text-align: center;
`;

const CardName = styled.div`
    position: relative;
    top: 15px;
    font-size: 0.5rem;
    color: transparent;
    z-index: 10;
`;

const Spacer = styled.div`
`

const toArrayOfIntervals = (array, interval) => (
    Array(Math.ceil(array.length / interval)).fill(0).map(
        (_, i) => array.slice(i * interval, i * interval + interval)
    )
)

const ColorCheckBox  = ({colorInfo: [name, image]}) => {
    
    const { setColorOnColorFilter, colorFilter } = useCards();

    return <>
        <CheckBox 
            checked={colorFilter[name]}
            name={name} 
            type="checkbox" 
            onChange={(e) => setColorOnColorFilter(name, e.target.checked)}
        />
        <Img width="60" src={image} alt={name}/>
    </>
};


const Card = ({card, x, y}) => {

    const { addRemoveList, setAddRemoveList } = useCards();
    const [backFace, setBackFace] = useState(false);

    const cardQuantityClick = (e, card, change) => {
        e.preventDefault();
        setAddRemoveList((prev) => ({
            ...prev,
            [card.oracle_id]:(Math.max((prev[card.oracle_id] ?? 1) + change, 0))
        }))
    }

    const findImage = () => (
        (!card?.image_uris ?? false) 
        ? card.card_faces[backFace ? 1 : 0].image_uris.normal
        : card.image_uris.normal
    )

    return <CardWrap>
        <CardNameWrap>
            <CardName>
                {
                    (card?.card_faces ?? false)
                        ? card.card_faces[0].name + " // " + card.card_faces[1].name
                        : card.name
                }
            </CardName>
        </CardNameWrap>
        <Img onClick={(e) => cardQuantityClick(e, card, -1)} src={findImage()} key={`card${x},${y}`}/>
        <CardQuantityWrap>
            {
                (!card?.image_uris ?? false) && <FlipCardButton onClick={() => setBackFace((prev) => !prev)}>
                    <FlipIcon height={70} src={rotate} alt="Flip Card"/>
                </FlipCardButton>
            }
            <AddRemoveCard draggable="false" onClick={(e) => cardQuantityClick(e, card, -1)} height={60} src={minus} alt="-"/>
            <CardQuantity>{(addRemoveList[card.oracle_id] ?? 1)}</CardQuantity>
            <AddRemoveCard draggable="false" onClick={(e) => cardQuantityClick(e, card, +1)} height={60} src={plus} alt="+"/>
            {
                (!card?.image_uris ?? false) && <FlipCardButton onClick={() => setBackFace((prev) => !prev)}>
                    <FlipIcon height={70} src={rotate} alt="Flip Card"/>
                </FlipCardButton>
            }
        </CardQuantityWrap>
    </CardWrap>
};

export const CardSearchWrapper = () => {
    const { db, resetAddRemoveList, addRemoveList, showBannedCards, setShowBannedCards, setFilterType, colorFilter, cardSearch,  setCardSearch } = useCards();

    useEffect(() => {
        resetAddRemoveList()
    },[cardSearch])

    return <Column>
        <Wrapper>
            <Label htmlFor="colorFilter"> Filter by </Label>
            <Select name="colorFilter" value={colorFilter.colorFilter} onChange={(e) => setFilterType(e.target.value)}>
                <Option value="colorIdentity"> Color Identity</Option>
                <Option value="color"> Color </Option>
            </Select>
            <Row>
                {
                    [["white", W], ["blue", U], ["black", B], ["red", R], ["green", G], ["colorless", C]].map((colorInfo, i) => 
                        <Fragment key={`fragment${i}`}>
                            { colorInfo[0] === "colorless" && <Vl/> }
                            <ColorCheckBox key={`colorCheckBox${i}`} colorInfo={colorInfo}/>
                        </Fragment >
                    )
                }
                <SmallLabel htmlFor="showBannedCards"> Show Banned </SmallLabel>
                <CheckBox 
                    checked={showBannedCards}
                    name="showBannedCards"
                    type="checkbox" 
                    onChange={(e) => setShowBannedCards(prev => !prev)}
                />
            </Row>
        </Wrapper>
        <Row>
            <SmallLabel>{"Total Results: " + (db?.total_cards ?? 0)}</SmallLabel>
            <Search placeholder="Card Name" onChange={(e) => setCardSearch(e.target.value)}/>
            <SubSearch placeholder="Catagory" onChange={(e) => {}}/>
        </Row>
        <Column>
            { db.has_more && <div>Please Refine Search</div> }
            {
                db && !db.has_more && toArrayOfIntervals(db.data, 5).map((section, x) => 
                    <Row key={`row${x}`}>
                        {
                            section.map((card, y) => <Card key={`card${x},${y}`} card={card} x={x} y={y}/>)
                        }
                    </Row>
                )
            }
        </Column>
        <button onClick={() => console.log(db)}>Print DB</button>
    </Column>
}