import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';

interface ActionsEntry {
  harvests: FormGroup<{
    red: FormControl<number>,
    green: FormControl<number>,
    orange: FormControl<number>,
    purple: FormControl<number>
  }>,
  purchases: FormGroup<{
    bucket: FormControl<number>,
    well: FormControl<number>,
    boots: FormControl<number>,
    coins: FormControl<number>,
    red: FormControl<number>,
    green: FormControl<number>,
    orange: FormControl<number>,
    purple: FormControl<number>,
    bag: FormControl<number>,
    gear: FormControl<number>
  }>
}

interface ActionsForm {
  calculator: FormArray<FormGroup<ActionsEntry>>
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup<ActionsForm>;

  constructor(private fb: UntypedFormBuilder) {
    this.form = this.fb.group({
      calculator: this.fb.array([
        this.createActionLine()
      ])
    })
  }

  ngOnInit(): void {

  }

  private createActionLine(): FormGroup<ActionsEntry> {
    const fb = this.fb;
    return fb.group({
      harvests: fb.group({
        red: fb.control(0),
        green: fb.control(0),
        orange: fb.control(0),
        purple: fb.control(0)
      }),
      purchases: fb.group({
        bucket: fb.control(0),
        well: fb.control(0),
        boots: fb.control(0),
        coins: fb.control(0),
        red: fb.control(0),
        green: fb.control(0),
        orange: fb.control(0),
        purple: fb.control(0),
        bag: fb.control(0),
        gear: fb.control(0)
      })
    })
  }
}
