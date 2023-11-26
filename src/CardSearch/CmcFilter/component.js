import React, { Fragment } from "react";
import styled from "styled-components";
import { useCards } from "../../contexts/CardContext";
import Zero from "./icons/genericManaSymbols/0.svg";
import One from "./icons/genericManaSymbols/1.svg";
import Two from "./icons/genericManaSymbols/2.svg";
import Three from "./icons/genericManaSymbols/3.svg";
import Four from "./icons/genericManaSymbols/4.svg";
import Five from "./icons/genericManaSymbols/5.svg";
import Six from "./icons/genericManaSymbols/6.svg";
import Seven from "./icons/genericManaSymbols/7.svg";
import Eight from "./icons/genericManaSymbols/8.svg";
import Nine from "./icons/genericManaSymbols/9.svg";

const Img = styled.img``;
const Option = styled.option``;

const SelectColorType = styled.select`
    font-size: 2rem;
    padding: 5px 10px;
    margin: 10px;
    color: black;
`;

const Vl = styled.span`
    border-left: 4px solid lightgray;
    height: 40px;
    margin: 0 20px;
`;

const Label = styled.label`
    margin-right: 10px;
`;

const CheckBox = styled.input`
    width: 30px;
    height: 30px;
    margin: 20px;
`;

const Wrapper = styled.div`
    margin-top: 20px;
    font-size: 3rem;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const SmallLabel = styled.label`
    margin-left: 30px;
    font-size: 1.5rem;
`;

const Row = styled.div`
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const NumberCheckBox  = ({numberInfo: [num, image]}) => {
    
    const { setCmcFilter, cmcFilter } = useCards();

    return <>
        <CheckBox checked={cmcFilter === num} name={num} type="checkbox" onChange={() => setCmcFilter(cmcFilter === num ? "" : num)}/>
        <Img width="60" src={image} alt={num}/>
    </>
};

export const CmcFilterWrapper = () => {

    const { cmcType, cmcFilterType, setCmcFilterType } = useCards();

    return <Wrapper>
        <Label htmlFor="colorFilter"> CMC </Label>
        <SelectColorType name="colorFilter" value={cmcFilterType} onChange={(e) => setCmcFilterType(e.target.value)}>
            <Option value="=">  {"="}  </Option>
            <Option value="!="> {"!="} </Option>
            <Option value=">">  {">"}  </Option>
            <Option value="<">  {"<"}  </Option>
            <Option value=">="> {">="} </Option>
            <Option value="<="> {"<="} </Option>
        </SelectColorType>
        <Row>
            { [[0, Zero], [1, One], [2, Two], [3, Three], [4, Four], [5, Five], [6, Six], [7, Seven], [8, Eight], [9, Nine]].map((numberInfo, i) => 
                <Fragment key={`fragment${i}`}>
                    <NumberCheckBox key={`numberCheckBox${i}`} numberInfo={numberInfo}/>
                </Fragment >
            )}
        </Row>
    </Wrapper>
}