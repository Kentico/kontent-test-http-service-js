import { DeliveryClient } from '@kentico/kontent-delivery'

import { KontentTestHttpService, FakeResponseConfig } from '../index'

describe('delivery client is compatible with', () => {
  it('providing the advanced test http service', async () => {
    const fakeResponseConfig = new Map<RegExp, FakeResponseConfig>()
    const fakeItem = {
      system: {
        id: '1a3aa6bd-7b4b-486f-86ab-7bfe359ad614',
        name: 'Main project',
        codename: 'main_project',
        language: 'default',
        type: 'project',
        sitemap_locations: [],
        last_modified: '2018-12-28T12:53:59.0753983Z'
      },
      elements: {
        content: {
          type: 'text',
          name: 'Content',
          value: 'Main project content'
        }
      }
    }
    const fakeType = {
      system: {
        id: 'ec706130-b0dd-401c-ae1a-10f2eeb2eb89',
        name: 'Project',
        codename: 'project',
        last_modified: '2018-12-28T12:29:09.4933517Z'
      },
      elements: {
        content: {
          type: 'text',
          name: 'Content'
        }
      }
    }

    fakeResponseConfig.set(/https:\/\/deliver.kontent.ai\/.*\/items/, {
      fakeResponseJson: {
        items: [fakeItem],
        modular_content: {},
        pagination: {
          continuation_token: null,
          next_page: null
        }
      },
      throwError: false
    })

    fakeResponseConfig.set(/https:\/\/deliver.kontent.ai\/.*\/types/, {
      fakeResponseJson: {
        types: [fakeType],
        pagination: {
          continuation_token: null,
          next_page: null
        }
      },
      throwError: false
    })

    const fakeHttpService = new KontentTestHttpService(fakeResponseConfig)
    const deliveryClientConfig = {
      projectId: 'dummyProject',
      typeResolvers: [],
      httpService: fakeHttpService
    }
    const client = new DeliveryClient(deliveryClientConfig)
    const itemsResult = await client.items().toPromise()
    const typesResult = await client.types().toPromise()

    expect(itemsResult.items).toHaveLength(1)
    expect(
      itemsResult.firstItem &&
        itemsResult.firstItem.system &&
        itemsResult.firstItem.system.codename
    ).toEqual(fakeItem.system.codename)
    expect(typesResult.types).toHaveLength(1)
    expect(
      typesResult.types[0] &&
        typesResult.types[0].system &&
        typesResult.types[0].system.codename
    ).toEqual(fakeType.system.codename)
  })
})
