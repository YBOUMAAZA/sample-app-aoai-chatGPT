import { Outlet, Link } from 'react-router-dom';
import styles from './Layout.module.css';
import Azure from '../../assets/Azure.svg';
import { CopyRegular, ShareRegular } from '@fluentui/react-icons';
import { CommandBarButton, Dialog, Stack, TextField, ICommandBarStyles, IButtonStyles, DefaultButton } from '@fluentui/react';
import { useContext, useEffect, useState } from 'react';
import { HistoryButton } from '../../components/common/Button';
import { AppStateContext } from '../../state/AppProvider';
import { CosmosDBStatus } from '../../api';

const shareButtonStyles: ICommandBarStyles & IButtonStyles = {
  root: {
    width: 86,
    height: 32,
    borderRadius: 4,
    background: 'radial-gradient(109.81% 107.82% at 100.1% 90.19%, #0F6CBD 33.63%, #2D87C3 70.31%, #8DDDD8 100%)',
    //   position: 'absolute',
    //   right: 20,
    padding: '5px 12px',
    marginRight: '20px',
  },
  icon: {
    color: '#FFFFFF',
  },
  rootHovered: {
    background: 'linear-gradient(135deg, #0F6CBD 0%, #2D87C3 51.04%, #8DDDD8 100%)',
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '20px',
    color: '#FFFFFF',
  },
};

const Layout = () => {
  const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
  const [copyClicked, setCopyClicked] = useState<boolean>(false);
  const [copyText, setCopyText] = useState<string>('Copy URL');
  const appStateContext = useContext(AppStateContext);

  const handleShareClick = () => {
    setIsSharePanelOpen(true);
  };

  const handleSharePanelDismiss = () => {
    setIsSharePanelOpen(false);
    setCopyClicked(false);
    setCopyText('Copy URL');
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyClicked(true);
  };

  const handleHistoryClick = () => {
    appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' });
  };

  useEffect(() => {
    if (copyClicked) {
      setCopyText('Copied URL');
    }
  }, [copyClicked]);

  useEffect(() => {}, [appStateContext?.state.isCosmosDBAvailable.status]);

  return (
    <div className={styles.layout}>
      <header className={styles.header} role={'banner'}>
        <Stack
          horizontal
          verticalAlign='center'
          horizontalAlign='space-between'
          // className={styles.headerContainer}
        >
          <Stack horizontal verticalAlign='center'>
            <img src={Azure} className={styles.headerIcon} aria-hidden='true' />
            <Link to='/' className={styles.headerTitleContainer}>
              <p className={styles.headerText}>Powered by GPT-4</p>
            </Link>
            <p className={styles.headerText}>
              <a
                href='https://edenred.sharepoint.com/:b:/s/AI/ESTxTqh6Go1ApEoxPIa_vY8BWD6OkuPY0ksg3gP_tSD7tA?e=wbaaCb'
                target='_blank'
                rel='noopener noreferrer'>
                Quick Start
              </a>
              🚀
              <a
                href='https://edenred.sharepoint.com/sites/AI/Shared Documents/Forms/AllItems.aspx?id=%2Fsites%2FAI%2FShared%20Documents%2FEdenChat%2FPrivacy%5FNotice%5FEdenChat%2Epdf&viewid=0f59080b%2Dbd34%2D4b53%2Db696%2Dbe62f75ed3d0&parent=%2Fsites%2FAI%2FShared%20Documents%2FEdenChat'>
                Privacy Notice
              </a>
              🕵️‍♂️
              <a href='https://forms.office.com/e/TbQBkx7XCz' target='_blank' rel='noopener noreferrer'>
                Feedback
              </a>
              👍
            </p>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 4 }}>
            {appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured && (
              <HistoryButton
                onClick={handleHistoryClick}
                text={appStateContext?.state?.isChatHistoryOpen ? 'Hide chat history' : 'Show chat history'}
              />
            )}
          </Stack>
        </Stack>
      </header>
      <Outlet />
      <Dialog
        onDismiss={handleSharePanelDismiss}
        hidden={!isSharePanelOpen}
        styles={{
          main: [
            {
              selectors: {
                ['@media (min-width: 480px)']: {
                  maxWidth: '600px',
                  background: '#FFFFFF',
                  boxShadow: '0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  maxHeight: '200px',
                  minHeight: '100px',
                },
              },
            },
          ],
        }}
        dialogContentProps={{
          title: 'Share the web app',
          showCloseButton: true,
        }}>
        <Stack horizontal verticalAlign='center' style={{ gap: '8px' }}>
          <TextField className={styles.urlTextBox} defaultValue={window.location.href} readOnly />
          <div
            className={styles.copyButtonContainer}
            role='button'
            tabIndex={0}
            aria-label='Copy'
            onClick={handleCopyClick}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? handleCopyClick() : null)}>
            <CopyRegular className={styles.copyButton} />
            <span className={styles.copyButtonText}>{copyText}</span>
          </div>
        </Stack>
      </Dialog>
    </div>
  );
};

export default Layout;
