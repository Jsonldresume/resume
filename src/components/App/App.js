/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect, useContext, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { PanZoom } from 'react-easy-panzoom';

import AppContext from '../../context/AppContext';
import PageContext from '../../context/PageContext';

import templates from '../../templates';
import PageController from '../../shared/PageController';
import PrintDialog from '../../shared/PrintDialog';
import PanZoomAnimation from '../../shared/PanZoomAnimation';
  
const App = ({theme='Celebi'}) => {
  const pageRef = useRef(null);
  const panZoomRef = useRef(null);
  const { i18n } = useTranslation();

  const context = useContext(AppContext);
  const { state, dispatch } = context;
  const { settings } = state;

  const pageContext = useContext(PageContext);
  const { setPageRef, setPanZoomRef } = pageContext;

  useEffect(() => {
    setPageRef(pageRef);
    setPanZoomRef(panZoomRef);
    i18n.changeLanguage(settings.language);
    const storedState = JSON.parse(localStorage.getItem('state'));
    //dispatch({ type: 'import_data', payload: storedState });
    fetch("resume.json",{
      method: "GET"
    }).then(response => response.json()).then(result => {
      //dispatch({ type: 'import_data', payload: result });
      let newData = {};
      if(storedState){
        newData = storedState;
      }
      newData.data = result;
      dispatch({ type: 'import_data', payload: newData });
    });
  }, [dispatch, setPageRef, setPanZoomRef, i18n, settings.language]);

  return (
    <Suspense fallback="Loading...">
      <div className="h-screen grid grid-cols-5 items-center">

        <div className="relative z-10 h-screen overflow-hidden col-span-5 flex justify-center items-center">
          <PanZoom
            ref={panZoomRef}
            minZoom="0.4"
            autoCenter
            autoCenterZoomLevel={0.7}
            enableBoundingBox
            boundaryRatioVertical={0.8}
            boundaryRatioHorizontal={0.8}
            style={{ outline: 'none' }}
          >
            <div id="page" ref={pageRef} className="shadow-2xl break-words">
              {templates.find(x => theme.toLowerCase() === x.key).component()}
            </div>
          </PanZoom>

          <PageController />
        </div>

        <div id="printPage" className="break-words">
          {templates.find(x => theme.toLowerCase() === x.key).component()}
        </div>

        <PanZoomAnimation />
        <PrintDialog />
      </div>
    </Suspense>
  );
};

export default App;
