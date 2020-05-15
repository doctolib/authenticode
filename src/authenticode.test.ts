import { getAuthenticode, summary } from './authenticode'

function path(kind: string): string {
  return `./src/sign-${kind}.ps1`
}

describe(getAuthenticode, () => {
  it.each([
    ['good', expect.anything()],
    ['bad', expect.anything()],
    ['ugly', null],
  ])('result matches snapshot for %s signature', async (kind, SignerCertificate) => {
    const signature = await getAuthenticode(path(kind))
    expect(signature).toMatchSnapshot({
      StatusMessage: expect.any(String),
      Path: expect.any(String),
      SignerCertificate,
    })
  })
})

const doctolibSubject = [
  'E=connectors@doctolib.com',
  'CN=Doctolib SAS',
  'O=Doctolib SAS',
  'STREET=32 Rue de Monceau',
  'L=Paris',
  'S=Ile de France',
  'C=FR',
  'OID.1.3.6.1.4.1.311.60.2.1.3=FR',
  'SERIALNUMBER=794598813',
  'OID.2.5.4.15=Private Organization',
].join(', ')

describe(summary, () => {
  it.each([
    ['good', { status: 'Valid', type: 'Authenticode', subject: doctolibSubject }],
    ['bad', { status: 'HashMismatch', type: 'Authenticode', subject: doctolibSubject }],
    ['ugly', { status: 'NotSigned', type: 'None', subject: null }],
  ])('result matches snapshot for %s signature', async (kind, expected) => {
    const signature = await getAuthenticode(path(kind))
    expect(summary(signature)).toEqual(expected)
  })
})
