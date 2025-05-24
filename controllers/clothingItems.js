const clothingItem =  require('../models/clothingItems');

const createItem = (req, res) =>{

  const {name, weather, imageUrl} = req.body;

  clothingItem.create({name, weather, imageUrl})
  .then((item)=>{
    res.send({data : item});

  }).catch((err)=>{
     if(err.name === "ValidationError"){
    return res.status(400).send({message: err.message});
  }
    return  res.status(500).send({message: " Error from createItem" , err})
    })
}

const getItems =(req, res) =>{
  clothingItem.find({}).then((items)=> res.status(200).send(items))
  .catch((err)=>{
    res.status(500).send({message: " Error from getItems" , err})
  })
}

const updateItem = (req, res) =>{
  const {itemId} = req.params;
  const {imageUrl} = req.body;
  clothingItem.findByIdAndUpdate(itemId, {$set:{imageUrl}}).orFail().then((item)=>
    res.status(200).send({data:item}))
  .catch(()=>{
    res.status(500).send({message:"error from updateItems"})
  })
}

const deleteItem = (req, res) =>{
  const {itemId} = req.params;
  console.log(itemId);
  clothingItem.findByIdAndDelete(itemId).orFail().then(()=>
    res.status(204).send({}))
  .catch(()=>{
    res.status(500).send({message:"error from deleteItems"})
  }
  )
}


module.exports = {createItem, getItems, updateItem, deleteItem}