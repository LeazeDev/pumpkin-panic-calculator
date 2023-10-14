import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { cropValues, prices } from './values';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup<ActionsForm>;
  state: State[];

  startingState: State = {
    bucket: 0,
    well: 0,
    boots: 0,
    moneyUpgrade: 0,
    bag: 0,

    redUnlock: false,
    greenUnlock: false,
    orangeUnlock: false,
    purpleUnlock: false,
    red: 0,
    green: 0,
    orange: 0,
    purple: 0,
    gear: 0,

    money: 0,
  };

  get priceArray(): [string, number[]][] {
    return [
      ["Bucket", prices.bucket],
      ["Well", prices.well],
      ["Boots", prices.boots],
      ["Coins", prices.coins],
      ["Bag", prices.bag],
      ["Red", [prices.unlockRed, prices.red]],
      ["Green", [prices.unlockGreen, prices.green]],
      ["Orange", [prices.unlockOrange, prices.orange]],
      ["Purple", [prices.unlockPurple, prices.purple]],
      ["Gear", [prices.gear]],
    ]
  }

  constructor(
    private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      calculator: this.fb.array([
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine(),
        this.createActionLine()
      ])
    });
    this.state = [];
    this.recalculateState();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const data = JSON.parse(params['data'] ?? "[]");
      if (!!data || Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          this.form.controls.calculator.controls[i].setValue({
            harvests: {
              white: row[0],
              red: row[1],
              green: row[2],
              orange: row[3],
              purple: row[4]
            },
            upgrades: {
              bucket: row[5],
              well: row[6],
              boots: row[7],
              coins: row[8],
              bag: row[9],
              red: row[10],
              green: row[11],
              orange: row[12],
              purple: row[13],
              gear: row[14],
            },
            loot: {
              lootValue: row[15]
            }
          });
        }
      }

      this.recalculateState();
    });
    this.form.valueChanges.subscribe(() => this.recalculateState());
  }

  resetForm(): void {
    this.form.reset();
  }

  recalculateState(): void {
    this.form.controls.calculator.controls.forEach((control, idx) => {
      const previousState = idx > 0 ? this.state[idx - 1] : this.startingState;
      this.enforceRules(previousState, control);

      const upgrades = control.controls.upgrades.value;
      const currCropValues = cropValues[previousState.moneyUpgrade];

      const harvests = control.controls.harvests.value;
      const income
        = (harvests.white ?? 0) * currCropValues[0]
        + (harvests.red ?? 0) * currCropValues[1]
        + (harvests.green ?? 0) * currCropValues[2]
        + (harvests.orange ?? 0) * currCropValues[3]
        + (harvests.purple ?? 0) * currCropValues[4]
        + +(control.value.loot?.lootValue ?? 0);

      const expenses = this.calculateExpenses(previousState, control);


      this.state[idx] = {
        bucket: upgrades.bucket ?? 0,
        well: upgrades.well ?? 0,
        boots: upgrades.boots ?? 0,
        moneyUpgrade: upgrades.coins ?? 0,

        redUnlock: previousState.redUnlock || !!upgrades.red,
        greenUnlock: previousState.greenUnlock || !!upgrades.green,
        orangeUnlock: previousState.orangeUnlock || !!upgrades.orange,
        purpleUnlock: previousState.purpleUnlock || !!upgrades.purple,

        red: upgrades.red ?? 0,
        green: upgrades.green ?? 0,
        orange: upgrades.orange ?? 0,
        purple: upgrades.purple ?? 0,

        bag: upgrades.bag ?? 0,
        gear: upgrades.gear ?? 0,

        money: previousState.money + income - expenses
      };
    });
  }

  saveToUrl(): void {
    const formAsArray = this.form.value.calculator?.map(row => {
      const harvests = row.harvests!;
      const upgrades = row.upgrades!;
      const loot = row.loot!;
      return [
        harvests.white,
        harvests.red,
        harvests.green,
        harvests.orange,
        harvests.purple,
        //
        upgrades.bucket,
        upgrades.well,
        upgrades.boots,
        upgrades.coins,
        upgrades.bag,
        upgrades.red,
        upgrades.green,
        upgrades.orange,
        upgrades.purple,
        upgrades.gear,
        //
        loot.lootValue
      ]
    });
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: { data: JSON.stringify(formAsArray) } }).then(() => {
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = window.location.href;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    });
  }

  private enforceRules(previousState: State, control: FormGroup<ActionsEntry>) {
    const upgradesControl = control.controls.upgrades;
    const upgrades = upgradesControl.value;

    upgradesControl.patchValue({ bucket: this.clamp(previousState.bucket, upgrades.bucket, prices.bucket.length) }, { emitEvent: false });
    upgradesControl.patchValue({ well: this.clamp(previousState.well, upgrades.well, prices.well.length) }, { emitEvent: false });
    upgradesControl.patchValue({ boots: this.clamp(previousState.boots, upgrades.boots, prices.boots.length) }, { emitEvent: false });
    upgradesControl.patchValue({ coins: this.clamp(previousState.moneyUpgrade, upgrades.coins, prices.coins.length) }, { emitEvent: false });
    upgradesControl.patchValue({ bag: this.clamp(previousState.bag, upgrades.bag, prices.bag.length) }, { emitEvent: false });
  }

  private calculateExpenses(previousState: State, control: FormGroup<ActionsEntry>) {
    const upgradesControl = control.controls.upgrades;
    const upgrades = upgradesControl.value;
    return this.calculateUpgradeExpenses(previousState.bucket, upgrades.bucket, prices.bucket)
      + this.calculateUpgradeExpenses(previousState.well, upgrades.well, prices.well)
      + this.calculateUpgradeExpenses(previousState.boots, upgrades.boots, prices.boots)
      + this.calculateUpgradeExpenses(previousState.moneyUpgrade, upgrades.coins, prices.coins)
      + this.calculateUpgradeExpenses(previousState.bag, upgrades.bag, prices.bag)
      + (upgrades.gear ?? 0) * prices.gear
      + (!upgrades.red || previousState.redUnlock ? 0 : prices.unlockRed) + (upgrades.red ?? 0) * prices.red
      + (!upgrades.green || previousState.greenUnlock ? 0 : prices.unlockGreen) + (upgrades.green ?? 0) * prices.green
      + (!upgrades.orange || previousState.orangeUnlock ? 0 : prices.unlockOrange) + (upgrades.orange ?? 0) * prices.orange
      + (!upgrades.purple || previousState.purpleUnlock ? 0 : prices.unlockPurple) + (upgrades.purple ?? 0) * prices.purple;
  }

  private calculateUpgradeExpenses(previousUpgrade: number, newUpgrade: number | undefined, upgradePrices: number[]) {
    let expenses = 0;
    while (previousUpgrade < (newUpgrade ?? 0)) {
      expenses += upgradePrices[previousUpgrade];
      previousUpgrade++;
    }
    return expenses;
  }

  private clamp(min: number, toClamp: number | undefined, max: number) {
    return Math.min(Math.max(toClamp ?? 0, min), max);
  }

  private createActionLine(): FormGroup<ActionsEntry> {
    const fb = this.fb;
    return fb.group({
      harvests: fb.group({
        white: fb.control(undefined, Validators.min(0)),
        red: fb.control(undefined, Validators.min(0)),
        green: fb.control(undefined, Validators.min(0)),
        orange: fb.control(undefined, Validators.min(0)),
        purple: fb.control(undefined, Validators.min(0))
      }),
      upgrades: fb.group({
        bucket: fb.control(undefined, Validators.min(0)),
        well: fb.control(undefined, Validators.min(0)),
        boots: fb.control(undefined, Validators.min(0)),
        coins: fb.control(undefined, Validators.min(0)),
        red: fb.control(undefined, Validators.min(0)),
        green: fb.control(undefined, Validators.min(0)),
        orange: fb.control(undefined, Validators.min(0)),
        purple: fb.control(undefined, Validators.min(0)),
        bag: fb.control(undefined, Validators.min(0)),
        gear: fb.control(undefined, Validators.min(0))
      }),
      loot: fb.group({
        lootValue: fb.control(undefined, Validators.min(0))
      })
    }, { updateOn: 'blur' })
  }
}

interface State {
  bucket: number;
  well: number;
  boots: number;
  moneyUpgrade: number;
  redUnlock: boolean;
  greenUnlock: boolean;
  orangeUnlock: boolean;
  purpleUnlock: boolean;
  red: number;
  green: number;
  orange: number;
  purple: number;
  bag: number;
  gear: number;
  money: number;
};

interface ActionsEntry {
  harvests: FormGroup<{
    white: FormControl<number>,
    red: FormControl<number>,
    green: FormControl<number>,
    orange: FormControl<number>,
    purple: FormControl<number>
  }>,
  upgrades: FormGroup<{
    bucket: FormControl<number>,
    well: FormControl<number>,
    boots: FormControl<number>,
    coins: FormControl<number>,
    bag: FormControl<number>,

    red: FormControl<number>,
    green: FormControl<number>,
    orange: FormControl<number>,
    purple: FormControl<number>,
    gear: FormControl<number>
  }>,
  loot: FormGroup<{
    lootValue: FormControl<number>
  }>
}

interface ActionsForm {
  calculator: FormArray<FormGroup<ActionsEntry>>
}
