const pdfjs = {
  getDocument: () => ({ promise: Promise.resolve({ numPages: 0 }) }),
  GlobalWorkerOptions: { workerSrc: '' },
  PDFDataRangeTransport: class {},
  version: 'mock',
};
export default pdfjs;
