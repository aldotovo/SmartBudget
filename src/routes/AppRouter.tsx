import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import { DashboardPage } from '../pages/DashboardPage'
import { HistoryPage } from '../pages/HistoryPage'
import { SettingsPage } from '../pages/SettingsPage'
import { TransactionsPage } from '../pages/TransactionsPage'
import { ImportBackupPage } from '../pages/ImportBackup'
import { MetasPage } from '../pages/MetasPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/config" element={<SettingsPage />} />
        <Route path="/import" element={<ImportBackupPage />} />
        <Route path="/metas" element={<MetasPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  )
}