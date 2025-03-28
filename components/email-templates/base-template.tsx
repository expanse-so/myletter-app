import React, { ReactNode } from 'react';

type BaseEmailTemplateProps = {
  previewText?: string;
  children: ReactNode;
};

export const BaseEmailTemplate: React.FC<BaseEmailTemplateProps> = ({
  previewText = 'Email from MyLetter',
  children,
}) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>{previewText}</title>
        <style>
          {`
            @media only screen and (max-width: 620px) {
              table.body h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important;
              }

              table.body p,
              table.body ul,
              table.body ol,
              table.body td,
              table.body span,
              table.body a {
                font-size: 16px !important;
              }

              table.body .wrapper,
              table.body .article {
                padding: 10px !important;
              }

              table.body .content {
                padding: 0 !important;
              }

              table.body .container {
                padding: 0 !important;
                width: 100% !important;
              }

              table.body .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important;
              }

              table.body .btn table {
                width: 100% !important;
              }

              table.body .btn a {
                width: 100% !important;
              }

              table.body .img-responsive {
                height: auto !important;
                max-width: 100% !important;
                width: auto !important;
              }
            }
            @media all {
              .ExternalClass {
                width: 100%;
              }

              .ExternalClass,
              .ExternalClass p,
              .ExternalClass span,
              .ExternalClass font,
              .ExternalClass td,
              .ExternalClass div {
                line-height: 100%;
              }

              .apple-link a {
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                text-decoration: none !important;
              }

              #MessageViewBody a {
                color: inherit;
                text-decoration: none;
                font-size: inherit;
                font-family: inherit;
                font-weight: inherit;
                line-height: inherit;
              }

              .btn-primary table td:hover {
                background-color: #7c3aed !important;
              }

              .btn-primary a:hover {
                background-color: #7c3aed !important;
                border-color: #7c3aed !important;
              }
            }
          `}
        </style>
      </head>
      <body
        style={{
          backgroundColor: '#f6f6f6',
          fontFamily: 'sans-serif',
          fontSize: '14px',
          lineHeight: '1.4',
          margin: 0,
          padding: 0,
          WebkitFontSmoothing: 'antialiased',
          textSizeAdjust: '100%',
          WebkitTextSizeAdjust: '100%',
        }}
      >
        <span
          style={{
            color: 'transparent',
            display: 'none',
            height: 0,
            maxHeight: 0,
            maxWidth: 0,
            opacity: 0,
            overflow: 'hidden',
            visibility: 'hidden',
            width: 0,
          }}
        >
          {previewText}
        </span>
        <table
          role="presentation"
          border={0}
          cellPadding="0"
          cellSpacing="0"
          className="body"
          style={{
            backgroundColor: '#f6f6f6',
            width: '100%',
            borderCollapse: 'separate',
          }}
        >
          <tr>
            <td style={{ fontSize: '14px', verticalAlign: 'top' }}>&nbsp;</td>
            <td
              className="container"
              style={{
                display: 'block',
                margin: '0 auto',
                maxWidth: '600px',
                padding: '10px',
                verticalAlign: 'top',
                width: '600px',
                fontSize: '14px',
              }}
            >
              <div
                className="content"
                style={{
                  boxSizing: 'border-box',
                  display: 'block',
                  margin: '0 auto',
                  maxWidth: '600px',
                  padding: '10px',
                }}
              >
                {/* START CENTERED WHITE CONTAINER */}
                <table
                  role="presentation"
                  className="main"
                  style={{
                    backgroundColor: '#ffffff',
                    borderCollapse: 'separate',
                    borderRadius: '3px',
                    width: '100%',
                  }}
                >
                  <tr>
                    <td
                      className="wrapper"
                      style={{
                        boxSizing: 'border-box',
                        padding: '20px',
                        verticalAlign: 'top',
                        fontSize: '14px',
                      }}
                    >
                      <table
                        role="presentation"
                        border={0}
                        cellPadding="0"
                        cellSpacing="0"
                        style={{
                          borderCollapse: 'separate',
                          width: '100%',
                        }}
                      >
                        <tr>
                          <td style={{ fontSize: '14px', verticalAlign: 'top' }}>
                            {children}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                {/* START FOOTER */}
                <div
                  className="footer"
                  style={{
                    clear: 'both',
                    marginTop: '10px',
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  <table
                    role="presentation"
                    border={0}
                    cellPadding="0"
                    cellSpacing="0"
                    style={{
                      borderCollapse: 'separate',
                      width: '100%',
                    }}
                  >
                    <tr>
                      <td
                        className="content-block"
                        style={{
                          color: '#999999',
                          fontSize: '12px',
                          textAlign: 'center',
                          verticalAlign: 'top',
                          paddingBottom: '10px',
                          paddingTop: '10px',
                        }}
                      >
                        <span className="apple-link" style={{ color: '#999999', fontSize: '12px', textAlign: 'center' }}>
                          MyLetter, Inc. 1234 Street Rd, Suite 1000. San Francisco, CA 94107
                        </span>
                        <br />
                        <span>
                          Don't like these emails?{' '}
                          <a href="{{unsubscribe_link}}" style={{ color: '#999999', fontSize: '12px', textAlign: 'center', textDecoration: 'underline' }}>
                            Unsubscribe
                          </a>
                          .
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="content-block powered-by"
                        style={{
                          color: '#999999',
                          fontSize: '12px',
                          textAlign: 'center',
                          verticalAlign: 'top',
                          paddingBottom: '10px',
                          paddingTop: '10px',
                        }}
                      >
                        Powered by{' '}
                        <a
                          href="https://myletter.expanse.so"
                          style={{
                            color: '#999999',
                            fontSize: '12px',
                            textAlign: 'center',
                            textDecoration: 'underline',
                          }}
                        >
                          MyLetter
                        </a>
                        .
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </td>
            <td style={{ fontSize: '14px', verticalAlign: 'top' }}>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
  );
};

export default BaseEmailTemplate;