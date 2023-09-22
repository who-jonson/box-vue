import chai from 'chai';
import BoxSdk from '../lib/BoxSdk.min.js';

chai.expect();

const expect = chai.expect;

describe('Given the BasicBoxClient', () => {
  describe('when instantiated', () => {
    let box;
    before(() => {
      box = new BoxSdk();
    });
    it('should set Simple Mode', () => {
      const client = new box.BasicBoxClient({ simpleMode: true });
      expect(client._simpleMode).to.be.true;
    });
    it('should set Options Only Mode', () => {
      const client = new box.BasicBoxClient({ noRequestMode: true });
      expect(client._returnsOnlyOptions).to.be.true;
    });
    it('should set Skip Validation Mode', () => {
      const client = new box.BasicBoxClient({ skipValidation: true });
      expect(client._skipValidation).to.be.true;
    });
    it('should have a default HTTP Service', () => {
      const client = new box.BasicBoxClient({});
      expect(typeof client.httpService).to.equal('function');
    });
    it('should set new HTTP Service', () => {
      const client = new box.BasicBoxClient({
        httpService() {
          return null;
        }
      });
      expect(typeof client.httpService).to.equal('function');
      expect(client.httpService()).to.equal(null);
    });
    it('should have a default Promise', () => {
      const client = new box.BasicBoxClient({});
      const promise = new client.Promise((resolve, reject) => { });
      expect(typeof client.Promise).to.equal('function');
      expect(typeof promise).to.equal('object');
      expect(typeof promise.then).to.equal('function');
    });
  });
});
