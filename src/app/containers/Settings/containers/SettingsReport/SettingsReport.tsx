import React from 'react';

import { Button, Window } from '@app/shared/components';
import { styled } from '@linaria/react';
import * as extensionizer from 'extensionizer';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { ROUTES } from '@app/shared/constants';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLogs } from '@app/containers/Settings/store/selectors';

const ReportStyled = styled.div`
  margin-bottom: 40px;
  padding: 0 26px;
  p {
    margin: 0;
    text-align: start;
    font-size: 16px;
    line-height: 1.25;
  }
`;

const TitleStyled = styled.h4`
  margin: 41px 0 24px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 700;
  text-align: left;
  line-height: 20px;
`;

const ListStyled = styled.ol`
  padding: 0px 19px;
  font-size: 14px;
  color: #808080;
  font-weight: 700;
  text-align: left;
  line-height: 20px;
  list-style: point;
`;
const ListItemStyled = styled.li``;
const LinkStyled = styled.span`
  cursor: pointer;
  color: #FF791F;;
  margin 0 3px;
`;

const SettingsReport = () => {
  const navigate = useNavigate();
  const logs: any = useSelector(selectLogs());

  const handlePrevious: React.MouseEventHandler = () => {
    navigate(ROUTES.SETTINGS.BASE);
  };

  const mailClicked = () => {
    const mailText = 'mailto:Hello@SOURC3.xyz';
    window.location.href = mailText;
  };

  const githubClicked = () => {
    window.open('https://github.com/SOURC3XYZ/Sourc3-Web-Client/issues', '_blank');
  };

  const saveLogsclicked = () => {
    const { version } = extensionizer.runtime.getManifest();
    const zip = new JSZip();
    const finalLogs = logs.common.concat(logs.errors).concat(logs.warns);

    zip.file('logs.log', finalLogs.join('\n'));
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `source-web-client-${version}-report.zip`);
    });

    navigate(ROUTES.SETTINGS.BASE);
  };

  return (
    <Window title="Report a problem" onPrevious={handlePrevious}>
      <ReportStyled>
        <TitleStyled>To report a problem:</TitleStyled>
        <ListStyled>
          <ListItemStyled>
            Click “Save wallet logs” bellow and choose a destination folder for log archive.
          </ListItemStyled>
          <ListItemStyled>
            Send email to
            <LinkStyled onClick={() => mailClicked()}>Hello@SOURC3.xyz</LinkStyled>
            or open a ticket in
            <LinkStyled onClick={() => githubClicked()}>Github</LinkStyled>
            {' '}
            (don’t forget to attach logs archive).
          </ListItemStyled>
        </ListStyled>
      </ReportStyled>
      <Button type="button" onClick={() => saveLogsclicked()}>
        Save wallet logs
      </Button>
    </Window>
  );
};

export default SettingsReport;
