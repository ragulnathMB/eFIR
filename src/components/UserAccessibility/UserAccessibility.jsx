import React, { useState, useEffect } from 'react';
import { useAccessibility } from './AccessibilityContext';
import styles from './UserAccessibility.module.css';
import userAccessibilityIcon from '../../assets/userAccessibilityIcon.svg';
import closeIcon from '../../assets/closeIcon.svg';
import textIncreaseIcon from '../../assets/textIncreaseIcon.svg';
import textDecreaseIcon from '../../assets/textDecreaseIcon.svg';
import darkContrastIcon from '../../assets/darkContrastIcon.svg';
import highContrastIcon from '../../assets/highContrastIcon.svg';
import resetIcon from '../../assets/resetIcon.svg';
import GoogleTranslate from '../GoogleTranslate/GoogleTranslate';
import { useNavigate } from 'react-router-dom';

const UserAccessibility = () => {
  const navigate=useNavigate();
  const goToHome=()=>{
    navigate('/');
  }
  const {
    increaseTextSize,
    decreaseTextSize,
    resetTextSize,
    toggleHighContrast,
    toggleDarkContrast,
    textSize,
    isHighContrast,
    isDarkContrast
  } = useAccessibility();

  const [modal, setModal] = useState(null);

  // Update styles globally when the context changes
  useEffect(() => {
    if (isHighContrast) {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    } else if (isDarkContrast) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'yellow';
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  }, [isHighContrast, isDarkContrast]);

  return (
    <>
      <div className={styles.mainBody}>
        <div></div>
        <div className={styles.mainContent}>
          <div className={styles.item}><p className={styles.text} onClick={goToHome}>Skip to main content</p></div>
          <div className={styles.item}><GoogleTranslate /></div>
          <div className={styles.item}>
            <img onClick={() => setModal('accessibility')} src={userAccessibilityIcon} />
          </div>
        </div>
      </div>

      {modal === 'accessibility' ? (
        <div className={styles.aModal}>
          <div className={styles.header}>
            <div><p className={styles.hText}>Accessibility Tools</p></div>
            <div><img onClick={() => setModal(null)} src={closeIcon} className={styles.closeImg} /></div>
          </div>
          <div className={styles.mOptions}>
            <div><p className={styles.mItemsH}>Text Size</p></div>
            <div className={styles.mItems}>
              <div className={styles.mItemsCont} onClick={increaseTextSize} >
                <div className={styles.mItemsImg}><img src={textIncreaseIcon} /></div>
                <div className={styles.mItemsText}><p>Increase</p></div>
              </div>
              <div className={styles.mItemsCont} onClick={decreaseTextSize}>
                <div className={styles.mItemsImg}><img src={textDecreaseIcon} /></div>
                <div className={styles.mItemsText}><p>Decrease</p></div>
              </div>
              <div className={styles.mItemsCont} onClick={resetTextSize}>
                <div className={styles.mItemsImg}><img src={resetIcon} /></div>
                <div className={styles.mItemsText}><p>Reset Size</p></div>
              </div>
            </div>
          </div>

          <div className={styles.mOptions}>
            <div><p className={styles.mItemsH}>Color Adjustments</p></div>
            <div className={styles.mItems}>
              <div className={styles.mItemsCont} onClick={toggleHighContrast}>
                <div className={styles.mItemsImg}><img src={highContrastIcon} /></div>
                <div className={styles.mItemsText}><p>High Contrast</p></div>
              </div>
              <div className={styles.mItemsCont} onClick={toggleDarkContrast}>
                <div className={styles.mItemsImg}><img src={darkContrastIcon} /></div>
                <div className={styles.mItemsText}><p>Dark Contrast</p></div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default UserAccessibility;
