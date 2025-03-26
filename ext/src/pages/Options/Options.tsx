import assert from 'assert';
import React, { useContext, useEffect } from 'react';
import { ScanQrContext } from '../../hooks/ScanQrContext';
import { Button } from '../Popup/DesignSystem';
import './Options.css';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const { setCameraPermissionGranted, isCameraPermissionGranted } = useContext(ScanQrContext);

  useEffect(() => {
    isCameraPermissionGranted().then((value) => {
      if (value) {
        const button = document.getElementById('cameraPermissionsSection');
        if (button) {
          button.style.display = 'none';
        }
      }
    });
  }, [isCameraPermissionGranted]);

  useEffect(() => {
    let button = document.getElementById('requestPermissionButton');
    assert(button, 'Internal error: no requestPermissionButton button');

    button.onclick = () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert('getUserMedia not supported');
      }

      navigator.mediaDevices
        .getUserMedia({ audio: false, video: { width: 320, height: 240 } })
        .then((stream: any) => {
          console.log('camera permission acquisition success');
          setCameraPermissionGranted(); // setting a flag in storage
          const item1 = document.getElementById('cameraPermissionsSection');
          if (item1) {
            item1.style.display = 'none';
          }

          const item2 = document.getElementById('cameraPermissionGranted');
          if (item2) {
            item2.style.display = 'block';
          }

          for (const track of stream.getTracks()) track.stop(); // stopping video after acquiring permissions
        })
        .catch(() => {
          const item = document.getElementById('cameraPermissionDenied');
          if (item) {
            item.style.display = 'block';
          }
        });
    };
  }, [setCameraPermissionGranted]);

  return (
    <div className="OptionsContainer">
      <div>
        <h1>{title}</h1>
        <br />

        <span id="cameraPermissionsSection" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          To allow reading QR codes via built-in
          <br />
          webcam please grant permissions:
          <br />
          <br />
          <Button id="requestPermissionButton">Allow Camera access</Button>
        </span>

        <span id="cameraPermissionGranted" style={{ display: 'none' }}>
          You are all set! It is safe to close this page
        </span>

        <span id="cameraPermissionDenied" style={{ display: 'none', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <br />
          Camera permission was denied. You will have to
          <br />
          manually open browser's permissions settings
          <br />
          and allow "Camera" for this extension.
        </span>
      </div>
    </div>
  );
};

export default Options;
