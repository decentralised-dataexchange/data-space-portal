/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React from 'react';
import './style.scss';
import spinner from '../../../public/img/loader.gif';
const Loader = ({
  styleClass = '',
}) => (
  <div
    className='d-flex align-items-center justify-content-center'
  >
    <div className={styleClass ? styleClass : 'loader'}>
      <img
        src={spinner}
        className={`spinner`}
      />
    </div>
  </div>
);

export default Loader;
