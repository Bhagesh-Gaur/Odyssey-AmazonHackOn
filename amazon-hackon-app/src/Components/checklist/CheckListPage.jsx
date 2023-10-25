
import styles from './styles.module.css'
import Container from '@mui/material/Container';
import { TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
const CheckListPage = () => {
    const params = useLocation()
    const searchParams = new URLSearchParams(params.search)
    const items = decodeURIComponent(searchParams.get('items'))
    let itemList = items.split(',')
    itemList[0] = itemList[0].slice(1)
    itemList[itemList.length-1] = itemList[itemList.length-1].slice(0,-1)
    
    const ItemRow = (props) =>{
      const [checked , setCheck] = useState(false)
      const [isDis , setDis] = useState(true)
      const clickHandler = (e)=>{
        window.open(`https://www.amazon.in/s?k=${e}`)
        window.focus()
        setCheck(true)
        setDis(false)
      }
      const handler2=()=>{
        setDis(true)
        setCheck(false)
      }
      
      return(
        <div className={styles.itemRow}>
        <div className={styles.item}  onClick={()=>clickHandler(props.data)}>{props.keyData+1}. {props.data}</div>
        <div>
          <Checkbox id={props.keyData} checked={checked} onClick={handler2} disabled={isDis} color="success" />
        </div>
        </div>
      )
    }
    return (
        <div className={styles.mainBg}>
          <Container>
          <div style={{color : "white" , padding:"10px" , fontSize: "larger" , fontWeight: "600"}}>Sure, here are your personalized AI generated Check-list.</div>
              <Container className={styles.itemBox}>
                <div className={styles.hd}>
                    <TextField  id="margin-dense" placeholder='Untitled-Checklist1' defaultValue="Untitled-Checklist1"variant="standard" />
                    
                </div>
                <div className={styles.itemArea}>                 
                  {itemList.map((item , key)=>{
                    return(<ItemRow data={item} keyData={key} />);
                  })}

                </div>
                <div className={styles.btnArea}>
                <button className={styles.btn2} >
                    Add more items
                </button>
                </div>
                <button className={styles.btn}>
                    Move Check-list to Cart
                </button>
                <button className={styles.btn}>
                    Buy Check-list Now
                </button>
              </Container>
                
                
          </Container>
        </div>
    )
}

export default CheckListPage