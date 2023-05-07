import React, { useState } from 'react';
import bigInt from 'big-integer';

function RSAInterface() {
    const [message, setMessage] = useState('Bonjour, ceci est un message secret.');
    const [publicKey, setPublicKey] = useState({});
    const [privateKey, setPrivateKey] = useState('');
    const [encryptedMessage, setEncryptedMessage] = useState('');
    const [decryptedMessage, setDecryptedMessage] = useState('');

    function estPremier(n) {
        if (n === 2) {
            return true;
        }
        if (n < 2 || n % 2 === 0) {
            return false;
        }
        for (let i = 3; i <= Math.sqrt(n); i += 2) {
            if (n % i === 0) {
                return false;
            }
        }
        return true;
    }

    function genererNombrePremier(min, max) {
        let nombrePremier = Math.floor(Math.random() * (max - min + 1)) + min;
        while (!estPremier(nombrePremier)) {
            nombrePremier++;
        }
        return nombrePremier;
    }

    function pgcd(a, b) {
        if (b === 0) {
            return a;
        }
        return pgcd(b, a % b);
    }

    function inverseModulo(a, n) {
        let t = 0,
            newT = 1,
            r = n,
            newR = a;

        while (newR !== 0) {
            const quotient = Math.floor(r / newR);
            [t, newT] = [newT, t - quotient * newT];
            [r, newR] = [newR, r - quotient * newR];
        }

        if (r > 1) {
            return null;
        }
        if (t < 0) {
            t += n;
        }
        return t;
    }

    function convertirEnEntiers(message) {
        let entiers = [];
        for (let i = 0; i < message.length; i++) {
            entiers.push(message.charCodeAt(i));
        }
        return entiers;
    }

    function convertirEnChaine(entiers) {
        let message = '';
        for (let i = 0; i < entiers.length; i++) {
            message += String.fromCharCode(entiers[i]);
        }
        return message;
    }

    function chiffrer(message, n, e) {
        const entiers = convertirEnEntiers(message);
        const chiffres = [];
        for (let i = 0; i < entiers.length; i++) {
            chiffres.push(bigInt(entiers[i]).modPow(e, n).toString());
        }
        return chiffres.join(' ');
    }

    function dechiffrer(chiffres, n, d) {
        const entiersChiffres = chiffres.split(' ');
        const entiersDechiffres = [];
        for (let i = 0; i < entiersChiffres.length; i++) {
            entiersDechiffres.push(
                bigInt(entiersChiffres[i]).modPow(d, n).toJSNumber()
            );
        }
        return convertirEnChaine(entiersDechiffres);
    }

    function genererClesRSA() {
        const p = genererNombrePremier(1000, 5000);
        let q = genererNombrePremier(1000, 5000)
        while (q === p) {
            q = genererNombrePremier(1000, 5000);
        }
        const n = p * q;
        const phiN = (p - 1) * (q - 1);

        let e = 2;
        while (e < phiN && pgcd(e, phiN) !== 1) {
            e++;
        }

        const d = inverseModulo(e, phiN);

        setPublicKey({ n, e });
        setPrivateKey(d);
    }

    function handleEncrypt() {
        const encrypted = chiffrer(message, publicKey.n, publicKey.e);
        setEncryptedMessage(encrypted);
    }

    function handleDecrypt() {
        const decrypted = dechiffrer(encryptedMessage, publicKey.n, privateKey);
        setDecryptedMessage(decrypted);
    }

    return (
        <div className='input-container'>
            <label>
                Message:
                <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </label>
            <div className="button-container">
        <button onClick={genererClesRSA}>Generate Keys</button>
      </div>
      <div className='key-container'>
            <div >
                <h4>Public Key:</h4>
                <p>n: {publicKey.n}</p>
                <p>e: {publicKey.e}</p>
            </div>
            <div>
                <h4>Private Key:</h4>
                <p>{privateKey}</p>
            </div>
            <button onClick={handleEncrypt}>Encrypt</button>
            </div>
            <div >
                <h4>Encrypted Message:</h4>
                <p>{encryptedMessage}</p>
            </div>
            <button onClick={handleDecrypt}>Decrypt</button>
            <div className='message-container'>
                <h4>Decrypted Message:</h4>
                <p>{decryptedMessage}</p>
            </div>
        </div>
    );
}
export default RSAInterface;
