import React, { useEffect, Suspense, useCallback } from 'react'
import AppSidebar from 'src/components/layout/AppSidebar'
import AppFooter from 'src/components/layout/AppFooter'
import AppHeader from 'src/components/layout/AppHeader'
import FullScreenLoading from 'src/components/utilities/Loading'
import { ModalRoot } from 'src/components/utilities/ModalRoot'
import Toasts from 'src/components/utilities/Toasts'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { CContainer } from '@coreui/react'
import { toggleSwitcher } from 'src/store/features/switcher'
import { useHotkeys } from 'react-hotkeys-hook'
import FastSwitcher from 'src/components/utilities/FastSwitcher'

const DefaultLayout = () => {
  const theme = useSelector((state) => state.app.currentTheme)
  useEffect(() => {
    document.body.classList = []
    document.body.classList.add(`theme-${theme}`)
    document.body.dataset.theme = theme
  })

  const dispatch = useDispatch()
  const handleFastSwitcher = useCallback(() => {
    dispatch(toggleSwitcher())
  }, [dispatch])

  useHotkeys(
    'ctrl+k',
    (event) => {
      handleFastSwitcher()
      event.preventDefault()
    },
    { filterPreventDefault: false },
  )
  useHotkeys(
    'cmd+k',
    (event) => {
      handleFastSwitcher()
      event.preventDefault()
    },
    { filterPreventDefault: false },
  )

  return (
    <div>
      <FastSwitcher />
      <ModalRoot />
      <Toasts />
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 px-xl-3">
          <CContainer fluid>
            <Suspense fallback={<FullScreenLoading />}>
              <Outlet />
            </Suspense>
          </CContainer>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
