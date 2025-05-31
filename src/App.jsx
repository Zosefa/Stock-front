import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './app.css'
import Dashboard from './page/Dashboard/Dashboard'
import Login from './page/Login/Login'
import Register from './page/register/register'
import TypeArticle from './page/TypeArticle/TypeArticle'
import Client from './page/Client/Client'

import 'react-phone-input-2/lib/material.css';
import Fournisseur from './page/fournisseur/Fournisseur'
import Article from './page/article/Article'
import Approvisionnement from './page/approvisionnement/Approvisionnement'
import Vente from './page/vente/Vente'
import Stock from './page/stock/Stock'
import Chart from './page/chart/Chart'
import NotFound from './page/notFound/NotFound'


function App() {
  return (
    <>
      <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Dashboard />}>
                  <Route index element={<Chart />} />
                  <Route path="type-article" element={<TypeArticle />} />
                  <Route path="client" element={<Client />} />
                  <Route path="fournisseur" element={<Fournisseur />} />
                  <Route path="article" element={<Article />} />
                  <Route path="approvisionnement" element={<Approvisionnement />} />
                  <Route path="vente" element={<Vente />} />
                  <Route path="stock" element={<Stock />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
