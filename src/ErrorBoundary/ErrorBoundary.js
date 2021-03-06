// @flow

import React, { type Node } from 'react';
import sx from '@adeira/sx';
import { fbt } from 'fbt';

import Button from '../Button/Button';
import Heading from '../Heading/Heading';
import Section from '../Section/Section';
import windowLocationReload from './windowLocationReload';

type Props = {
  +children: Node,
  +title?: FbtWithoutString,
  +code?: string,
  +onComponentDidCatch?: (Error, { componentStack: string, ... }) => void,
  +onRetry?: () => void,
};

type State = {
  +hasError: boolean,
  +error: Error | null,
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
    };
  }

  componentDidMount() {
    // prevents "The above error..." addendum from React (https://github.com/facebook/react/commit/3938ccc88aa3dcc5a4460474bda40af97dd6e234)
    window.addEventListener('error', (event) => event.preventDefault());
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string, ... }): void {
    if (this.props.onComponentDidCatch != null) {
      // allows to log the error to an error reporting service
      this.props.onComponentDidCatch(error, errorInfo);
    } else {
      // or simply print the error to console
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  render(): Node {
    const onRetryFn = this.props.onRetry ?? windowLocationReload;
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message;
      return (
        <div className={styles('error')}>
          <div>
            <Heading xstyle={styles.h1}>{this.props.code ?? '5XX'}</Heading>
            <Section xstyle={styles.desc}>
              <Heading xstyle={styles.h2}>
                {this.props.title ??
                  fbt('An unexpected error has occurred.', 'generic error message')}
              </Heading>
            </Section>
          </div>
          {__DEV__ && errorMessage != null ? (
            <div className={styles('errorDev')} data-testid="errorDev">
              <pre className={styles('errorDevPre')}>{errorMessage}</pre>
            </div>
          ) : null}
          <div className={styles('retry')}>
            <Button onClick={() => onRetryFn()}>
              <fbt desc="error boundary retry button title">Retry</fbt>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = sx.create({
  error: {
    color: 'rgb(var(--sx-foreground))',
    background: 'rgb(var(--sx-background))',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    height: '100vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    display: 'inline-block',
    textAlign: 'left',
    lineHeight: '49px',
    height: 49,
    verticalAlign: 'middle',
  },
  h1: {
    display: 'inline-block',
    borderInlineEnd: '1px solid rgba(var(--sx-foreground), 0.3)',
    margin: 0,
    marginInlineEnd: 20,
    paddingBlock: '10px',
    paddingInlineEnd: '23px',
    paddingInlineStart: '0px',
    fontSize: 24,
    fontWeight: 500,
    verticalAlign: 'top',
  },
  h2: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0,
  },
  errorDev: {
    width: 500,
    fontSize: 14,
    textAlign: 'left',
    padding: '.5rem 2rem .5rem 2rem',
    marginBlock: '2rem',
    color: 'rgba(var(--sx-warning-dark))',
    backgroundColor: 'rgba(var(--sx-warning-lighter))',
    borderRadius: 'var(--sx-radius)',
  },
  errorDevPre: {
    whiteSpace: 'pre-wrap',
  },
  retry: {
    fontSize: 14,
  },
});
