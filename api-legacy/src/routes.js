const express = require('express');
const router = express.Router();

router.get('/products', (req, res) => {
    res.status(200).json({ message: 'Retorna todos produtos' });
});

router.post('/product', (req, res) => {  
    const { input } = req.body;
    if (input === 'sim') {
      return res.status(200).json({ message: 'entrou na condicao da criacao do produto' });
    }
  
    return res.status(200).json({ message: 'nao entrou na condicao da criacao do produto' });
});
  

router.put('/product', (req, res) => {
    const { input } = req.body;
    if (input === '87') {
      return res.status(200).json({ message: 'o produto 87 foi atualizado' });
    }

    if (input === '98') {
      return res.status(200).json({ message: 'o produto 98 foi atualizado' });
    }

    if (input === '100') {
      return res.status(200).json({ message: 'o produto 100 foi atualizado' });
    }

    return res.status(200).json({ status: 'nao achou nenhum produto' });
});

module.exports = router;
