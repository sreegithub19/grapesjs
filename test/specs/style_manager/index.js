import Editor from 'editor/model/Editor';

describe('StyleManager', () => {
  describe('Main', () => {
    let obj;
    let em;

    beforeEach(() => {
      em = new Editor({});
      obj = em.get('StyleManager');
    });

    afterEach(() => {
      obj = null;
      em.destroy();
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('No sectors', () => {
      expect(obj.getSectors().length).toEqual(0);
    });

    test('Add sector', () => {
      obj.addSector('test', {
        name: 'Test name'
      });
      var sector = obj.getSectors({ array: true })[0];
      expect(obj.getSectors().length).toEqual(1);
      expect(sector.get('id')).toEqual('test');
      expect(sector.get('name')).toEqual('Test name');
    });

    test('Add sectors', () => {
      obj.addSector('test', {});
      obj.addSector('test2', {});
      expect(obj.getSectors().length).toEqual(2);
    });

    test("Can't create more than one sector with the same id", () => {
      var sect1 = obj.addSector('test', {});
      var sect2 = obj.addSector('test', {});
      expect(obj.getSectors().length).toEqual(1);
      expect(sect1).toEqual(sect2);
    });

    test('Get inexistent sector', () => {
      expect(obj.getSector('test')).toBeFalsy();
    });

    test('Get sector', () => {
      var sect1 = obj.addSector('test', { name: 'Test' });
      var sect2 = obj.getSector('test');
      expect(sect1).toEqual(sect2);
    });

    test('Add property to inexistent sector', () => {
      expect(obj.addProperty('test', {})).toEqual(null);
    });

    test('Add property', () => {
      obj.addSector('test', {});
      expect(obj.addProperty('test', {})).toBeTruthy();
      expect(obj.getProperties('test').length).toEqual(1);
    });

    test('Check added property', () => {
      obj.addSector('test', {});
      var prop = obj.addProperty('test', {
        name: 'test'
      });
      expect(prop.get('name')).toEqual('test');
    });

    test('Add properties', () => {
      obj.addSector('test', {});
      obj.addProperty('test', [{}, {}]);
      expect(obj.getProperties('test').length).toEqual(2);
    });

    test('Get property from inexistent sector', () => {
      expect(obj.getProperty('test', 'test-prop')).toEqual(null);
    });

    test("Can't get properties without proper name", () => {
      obj.addSector('test', {});
      obj.addProperty('test', [{}, {}]);
      expect(obj.getProperty('test', 'test-prop')).toEqual(null);
    });

    test('Get property with proper name', () => {
      obj.addSector('test', {});
      var prop1 = obj.addProperty('test', { property: 'test-prop' });
      var prop2 = obj.getProperty('test', 'test-prop');
      expect(prop1).toEqual(prop2);
    });

    test('Get properties with proper name', () => {
      obj.addSector('test', {});
      obj.addProperty('test', [
        { property: 'test-prop' },
        { property: 'test-prop' }
      ]);
      expect(obj.getProperty('test', 'test-prop')).toBeTruthy();
    });

    test('Get inexistent properties', () => {
      expect(obj.getProperties('test')).toEqual(null);
      expect(obj.getProperties()).toEqual(null);
    });

    test('Renders correctly', () => {
      expect(obj.render()).toBeTruthy();
    });

    describe('Init with configuration', () => {
      beforeEach(() => {
        em = new Editor({
          StyleManager: {
            sectors: [
              {
                id: 'dim',
                name: 'Dimension',
                properties: [
                  {
                    name: 'Width',
                    property: 'width'
                  },
                  {
                    name: 'Height',
                    property: 'height'
                  }
                ]
              },
              {
                id: 'pos',
                name: 'position',
                properties: [
                  {
                    name: 'Width',
                    property: 'width'
                  }
                ]
              }
            ]
          }
        });
        obj = em.get('StyleManager');
        obj.onLoad();
      });

      afterEach(() => {
        obj = null;
        em.destroy();
      });

      test('Sectors added', () => {
        expect(obj.getSectors().length).toEqual(2);
        var sect1 = obj.getSector('dim');
        expect(sect1.get('name')).toEqual('Dimension');
      });

      test('Properties added', () => {
        var sect1 = obj.getSector('dim');
        var sect2 = obj.getSector('pos');
        expect(sect1.get('properties').length).toEqual(2);
        expect(sect2.get('properties').length).toEqual(1);
      });

      test('Property is correct', () => {
        var prop1 = obj.getProperty('dim', 'width');
        expect(prop1.get('name')).toEqual('Width');
      });
    });
  });
});
